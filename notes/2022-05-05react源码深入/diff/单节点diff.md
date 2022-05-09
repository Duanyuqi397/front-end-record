## 单节点diff

对于单节点diff，以object为例，会进入reconcileSingleElement

函数内部会做如下事情：

![image-20220509145401307](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20220509145401307.png)

核心是判断dom节点是否可以复用

```javascript
function reconcileSingleElement(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  element: ReactElement
): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  
  // 首先判断是否存在对应DOM节点
  while (child !== null) {
    // 上一次更新存在DOM节点，接下来判断是否可复用

    // 首先比较key是否相同
    if (child.key === key) {

      // key相同，接下来比较type是否相同

      switch (child.tag) {
        // ...省略case
        
        default: {
          if (child.elementType === element.type) {
            // type相同则表示可以复用
            // 返回复用的fiber
            return existing;
          }
          
          // type不同则跳出switch
          break;
        }
      }
      // 代码执行到这里代表：key相同但是type不同
      // 将该fiber及其兄弟fiber标记为删除
      deleteRemainingChildren(returnFiber, child);
      break;
    } else {
      // key不同，将该fiber标记为删除
      deleteChild(returnFiber, child);
    }
    child = child.sibling;
  }

  // 创建新Fiber，并返回 ...省略
}
```

从代码可以看出，先比较key是否相同，当key相同了再比较type是否相同，只有当key和type都相同了，才可以复用

`当child !== null时：`

- `当key相同，type不同时，会调用deleteRemainingChildren，将child及其兄弟节点**全部标记删除**`
- `当key不同时，**只将child标记删除`**

原因是：

- 当key相同，type不同时，代表已经找到了本次更新的节点对应上一次的fiber，但是type不同，不能复用，唯一的可能都不能复用，后面的也没有机会，所以全部标记删除
- 当key不同时，只代表当前遍历到的fiber不能被复用，但是后续还有可能，所以只将当前的fiber节点标记删除

#### 练习

```jsx
// 习题1 更新前
<div>ka song</div>
// 更新后
<p>ka song</p>

// 习题2 更新前
<div key="xxx">ka song</div>
// 更新后
<div key="ooo">ka song</div>

// 习题3 更新前
<div key="xxx">ka song</div>
// 更新后
<p key="ooo">ka song</p>

// 习题4 更新前
<div key="xxx">ka song</div>
// 更新后
<div key="xxx">xiao bei</div>
```

1. key相同，type不同，不能复用，key未设置所以默认为null
2. key不同，不需要判断type，不能复用
3. key不同，type不同，不能复用
4. key和type都相同，可以复用