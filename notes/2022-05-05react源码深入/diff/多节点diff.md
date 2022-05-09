## 多节点diff

假如现在有一个FunctionComponent:

```js
function List () {
  return (
    <ul>
      <li key="0">0</li>
      <li key="1">1</li>
      <li key="2">2</li>
      <li key="3">3</li>
    </ul>
  )
}
```

它的jsx对象不是一个单一的节点，而是一个数组：

```jsx
{
  $$typeof: Symbol(react.element),
  key: null,
  props: {
    children: [
      {$$typeof: Symbol(react.element), type: "li", key: "0", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "1", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "2", ref: null, props: {…}, …}
      {$$typeof: Symbol(react.element), type: "li", key: "3", ref: null, props: {…}, …}
    ]
  },
  ref: null,
  type: "ul"
}
```

这时，reconcilerChildFibers的参数newChild类型为Array，这里就需要多节点diff

同级多个节点更新，一定属于以下三种情况之一：

1. 节点更新
2. 节点新增/删除
3. 节点位置变化

### diff思路

首先想到的方案是：根据不同的节点更新类型，调用不同的逻辑，但是有一个隐含的前提：**不同操作的优先级是相同的**

但是react团队发现，在日常开发中，更新组件发生的频率会更高，所以多节点diff会**优先判断类型是否是节点更新**

**注意：**

`本次更新的newChildren是array类型，通常做数组遍历的时候，会使用双指针遍历提高效率，但是这里不能使用双指针，因为和newChildren数组作比较的是current fiber，**同级的fiber是以sibling连接形成的单链表**，即newChildren[0]与fiber作比较，newChildren[1]与fiber.sibling比较，所以不能使用双指针`

基于以上逻辑，diff的时候会经历两次遍历：

1. 第一轮遍历，处理**更新**的节点
2. 第二轮遍历，处理剩下的不属于更新的节点

#### 第一轮遍历

第一轮遍历的步骤如下：

1. let i = 0,遍历newChildren，将newChildren[i]与oldFiber作比较，判断dom节点是否可以复用

2. 如果可以复用，i++,继续比较newChildren[i]与oldFiber.sibling

3. 如果不可以复用，分两种情况：（这里的**key和type判断情况与单节点diff时恰好相反**）

   key不同导致不可复用，立即跳出整个循环，第一轮遍历结束

   key相同type不同导致不可复用，将当前节点标记为DELETION，继续遍历

4. 当newChildren遍历完(i == newChildren.length - 1)或者oldFiber遍历完(即oldFiber.sibling == null)，结束第一轮遍历

当遍历完后，会有两种结果：

1. 第三步结束的遍历，此时newChildren和oldFiber都可能还没遍历完，例如

   ```js
   // 之前
   <li key="0">0</li>
   <li key="1">1</li>
   <li key="2">2</li>
               
   // 之后
   <li key="0">0</li>
   <li key="2">1</li>
   <li key="1">2</li>
   ```

   此时oldFiber还有剩下的key == 1,key == 2没有遍历完，newChildren还有剩下的key == 2,key == 1没有遍历完

2. 第四步结束的遍历，此时可能有3种情况

   ```js
   // 之前
   <li key="0" className="a">0</li>
   <li key="1" className="b">1</li>
               
   // 之后 情况1 —— newChildren与oldFiber都遍历完
   <li key="0" className="aa">0</li>
   <li key="1" className="bb">1</li>
               
   // 之后 情况2 —— newChildren没遍历完，oldFiber遍历完
   // newChildren剩下 key==="2" 未遍历
   <li key="0" className="aa">0</li>
   <li key="1" className="bb">1</li>
   <li key="2" className="cc">2</li>
               
   // 之后 情况3 —— newChildren遍历完，oldFiber没遍历完
   // oldFiber剩下 key==="1" 未遍历
   <li key="0" className="aa">0</li>
   ```

这个时候，带着第一轮遍历的结果，开始第二轮遍历

#### 第二轮遍历

对于第一轮的结果，第二轮遍历会有四种情况：

1. newChildren和oldFiber都遍历完了，这是最理想的情况，diff结束
2. newChildren遍历完了，oldFiber没有遍历完，这说明**本次更新相对于上一次节点减少了**，有节点被删除了，所以需要遍历剩下的fiber节点，依次标记DELETION
3. newChildren没有遍历完，oldFiber遍历完了，这说明**本次更新相对于上一次节点增加了**，所以需要遍历剩下的newChildren，为生成的workInProgress fiber依次标记Placement即可
4. newChildren和oldFiber都没有遍历完，这说明有节点在本次更新中改变了位置

**处理移动的节点**

因为节点位置发生了改变，现在就不能通过newChildren的下标获取节点了，所以需要通过key来获取

为了快速找到key对应的oldFiber，将所有还未处理的oldFiber存入**以key为key，oldFiber为value的Map**中

```js
const existingChildren = mapRemainingChildren(returnFiber,oldFiber)
```

接下来遍历剩余的`newChildren`，通过`newChildren[i].key`就能在`existingChildren`中找到`key`相同的`oldFiber`

**标记节点是否移动**

既然我们的目标是寻找移动的节点，那么我们需要明确：节点是否移动是以什么为参照物？

我们的参照物是：最后一个可复用的节点在`oldFiber`中的位置索引（用变量`lastPlacedIndex`表示）。

由于本次更新中节点是按`newChildren`的顺序排列。在遍历`newChildren`过程中，每个`遍历到的可复用节点`一定是当前遍历到的`所有可复用节点`中**最靠右的那个**，即一定在`lastPlacedIndex`对应的`可复用的节点`在本次更新中位置的后面。

那么我们只需要比较`遍历到的可复用节点`在上次更新时是否也在`lastPlacedIndex`对应的`oldFiber`后面，就能知道两次更新中这两个节点的相对位置改变没有。

我们用变量`oldIndex`表示`遍历到的可复用节点`在`oldFiber`中的位置索引。如果`oldIndex < lastPlacedIndex`，代表本次更新该节点需要向右移动。

`lastPlacedIndex`初始为`0`，每遍历一个可复用的节点，如果`oldIndex >= lastPlacedIndex`，则`lastPlacedIndex = oldIndex`。

单纯文字表达比较晦涩，这里我们提供两个Demo，可以对照着理解

**demo1**

```js
// 之前
abcd

// 之后
acdb

===第一轮遍历开始===
a（之后）vs a（之前）  
key不变，可复用
此时 a 对应的oldFiber（之前的a）在之前的数组（abcd）中索引为0
所以 lastPlacedIndex = 0;

继续第一轮遍历...

c（之后）vs b（之前）  
key改变，不能复用，跳出第一轮遍历
此时 lastPlacedIndex === 0;
===第一轮遍历结束===

===第二轮遍历开始===
newChildren === cdb，没用完，不需要执行删除旧节点
oldFiber === bcd，没用完，不需要执行插入新节点

将剩余oldFiber（bcd）保存为map

// 当前oldFiber：bcd
// 当前newChildren：cdb

继续遍历剩余newChildren

key === c 在 oldFiber中存在
const oldIndex = c（之前）.index;
此时 oldIndex === 2;  // 之前节点为 abcd，所以c.index === 2
比较 oldIndex 与 lastPlacedIndex;

如果 oldIndex >= lastPlacedIndex 代表该可复用节点不需要移动
并将 lastPlacedIndex = oldIndex;
如果 oldIndex < lastplacedIndex 该可复用节点之前插入的位置索引小于这次更新需要插入的位置索引，代表该节点需要向右移动

在例子中，oldIndex 2 > lastPlacedIndex 0，
则 lastPlacedIndex = 2;
c节点位置不变

继续遍历剩余newChildren

// 当前oldFiber：bd
// 当前newChildren：db

key === d 在 oldFiber中存在
const oldIndex = d（之前）.index;
oldIndex 3 > lastPlacedIndex 2 // 之前节点为 abcd，所以d.index === 3
则 lastPlacedIndex = 3;
d节点位置不变

继续遍历剩余newChildren

// 当前oldFiber：b
// 当前newChildren：b

key === b 在 oldFiber中存在
const oldIndex = b（之前）.index;
oldIndex 1 < lastPlacedIndex 3 // 之前节点为 abcd，所以b.index === 1
则 b节点需要向右移动
===第二轮遍历结束===

最终acd 3个节点都没有移动，b节点被标记为移动
```

**demo2**

```js
// 之前
abcd

// 之后
dabc

===第一轮遍历开始===
d（之后）vs a（之前）  
key改变，不能复用，跳出遍历
===第一轮遍历结束===

===第二轮遍历开始===
newChildren === dabc，没用完，不需要执行删除旧节点
oldFiber === abcd，没用完，不需要执行插入新节点

将剩余oldFiber（abcd）保存为map

继续遍历剩余newChildren

// 当前oldFiber：abcd
// 当前newChildren dabc

key === d 在 oldFiber中存在
const oldIndex = d（之前）.index;
此时 oldIndex === 3; // 之前节点为 abcd，所以d.index === 3
比较 oldIndex 与 lastPlacedIndex;
oldIndex 3 > lastPlacedIndex 0
则 lastPlacedIndex = 3;
d节点位置不变

继续遍历剩余newChildren

// 当前oldFiber：abc
// 当前newChildren abc

key === a 在 oldFiber中存在
const oldIndex = a（之前）.index; // 之前节点为 abcd，所以a.index === 0
此时 oldIndex === 0;
比较 oldIndex 与 lastPlacedIndex;
oldIndex 0 < lastPlacedIndex 3
则 a节点需要向右移动

继续遍历剩余newChildren

// 当前oldFiber：bc
// 当前newChildren bc

key === b 在 oldFiber中存在
const oldIndex = b（之前）.index; // 之前节点为 abcd，所以b.index === 1
此时 oldIndex === 1;
比较 oldIndex 与 lastPlacedIndex;
oldIndex 1 < lastPlacedIndex 3
则 b节点需要向右移动

继续遍历剩余newChildren

// 当前oldFiber：c
// 当前newChildren c

key === c 在 oldFiber中存在
const oldIndex = c（之前）.index; // 之前节点为 abcd，所以c.index === 2
此时 oldIndex === 2;
比较 oldIndex 与 lastPlacedIndex;
oldIndex 2 < lastPlacedIndex 3
则 c节点需要向右移动

===第二轮遍历结束===
```

