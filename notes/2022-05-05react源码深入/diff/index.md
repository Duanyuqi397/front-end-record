## diff

diff发生在Reconciler里，用于在组件更新过程中，对比两个组件，决定是否复用上一次更新时的组件

`一个dom节点在某一时刻最多会有四个节点和他相关：`

1. `current fiber，如果这个节点已经在页面中，那么current fiber代表该dom节点对应的fiber节点`
2. `workInProgress fiber，如果该节点需要在本次更新中渲染到页面中，那么workInProgress fiber代表该dom节点对应的fiber节点`
3. `dom节点本身`
4. `jsx对象，jsx对象中包含描述该dom节点的信息`

`diff的本质是，diff1和4，生成2`

### diff的瓶颈以及react的解决方案

因为diff算法本身就很耗费性能，react官方有提到过：即使是最前沿的算法，将前后两棵树完全对比的时间复杂度也会是O(n3),其中n是节点数量

为了降低算法复杂度，react预设了三个限制：

1. 只对同级元素进行diff，如果一个dom节点在前后两次更新中跨越了层级，react将不会尝试复用它
2. 两个不同类型的元素会产生不同的树，比如div -> p,react会销毁div及其子孙节点，创建p及其子孙节点
3. 开发者可以通过key props来暗示哪些元素在不同的渲染下能够保持稳定

### diff是如何实现的

diff的入口是reconcileChildFibers，该函数会根据newChild（jsx对象）类型调用不同的处理逻辑

```javascript
// 根据newChild类型选择不同diff函数处理
function reconcileChildFibers(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChild: any,
): Fiber | null {

  const isObject = typeof newChild === 'object' && newChild !== null;

  if (isObject) {
    // object类型，可能是 REACT_ELEMENT_TYPE 或 REACT_PORTAL_TYPE
    switch (newChild.$$typeof) {
      case REACT_ELEMENT_TYPE:
        // 调用 reconcileSingleElement 处理
      // // ...省略其他case
    }
  }

  if (typeof newChild === 'string' || typeof newChild === 'number') {
    // 调用 reconcileSingleTextNode 处理
    // ...省略
  }

  if (isArray(newChild)) {
    // 调用 reconcileChildrenArray 处理
    // ...省略
  }

  // 一些其他情况调用处理函数
  // ...省略

  // 以上都没有命中，删除节点
  return deleteRemainingChildren(returnFiber, currentFirstChild);
}
```

由此可以看出：

- 当child类型为object,number,string时，代表同级只有一个节点
- 当child类型为Array时，代表同级有多个节点

根据这两个分类，diff算法又分为单节点diff和多节点diff