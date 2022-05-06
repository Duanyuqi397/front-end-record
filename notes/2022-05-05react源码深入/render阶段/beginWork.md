## beginWork
    传入当前fiber节点，创建子fiber节点
```JavaScript
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes,
): Fiber | null {
  // ...省略函数体
}
```
    current:当前fiber节在上一次更新时的fiber节点，即workInProgress.alternate
    workInProgress:当前组件对应的fiber节点
    renderLanes:优先级相关
    current为null：说明当前组件在current中没有对应的fiber节点，说明是组件挂载时，所以又可以分为两种情况：mount和update
### mount
    除了fiberRootNode以外，current == null,所以mount阶段会根据fiber.tag的不同，创建不同类型的子fiber节点
    在mount之后，由于已经有子fiber节点，下一次更新时current !== null，所以会走update的逻辑
    创建fiber节点时，对于常见的组件类型(FunctionComponent/ClassComponent/HostComponent)，最终都会调用reconcileChildren
### update
    此时current存在，满足一定条件时(diff)，可以复用current上的fiber节点，这样就能克隆current.child作为workInProgress.child
#### reconcileChildren
    mount时，根据tag创建新的fiber节点
    update时，将当前组件与上次更新时对应的fiber节点做比较(diff)，将比较的结果用于生成新的fiber节点

    mountChildFibers与reconcileChildFibers这两个方法的逻辑基本一致。唯一的区别是：reconcileChildFibers会为生成的Fiber节点带上effectTag属性，而mountChildFibers不会。
#### effectTag
    render阶段是在内存中进行，当工作结束后会告诉renderer需要执行dom操作，而要执行的dom操作类型就保存在effectTag中
```JavaScript
// DOM需要插入到页面中
export const Placement = /*                */ 0b00000000000010;
// DOM需要更新
export const Update = /*                   */ 0b00000000000100;
// DOM需要插入到页面中并更新
export const PlacementAndUpdate = /*       */ 0b00000000000110;
// DOM需要删除
export const Deletion = /*                 */ 0b00000000001000;
```
    那么，如果要通知Renderer将Fiber节点对应的DOM节点插入页面中，需要满足两个条件：
    fiber.stateNode存在，即Fiber节点中保存了对应的DOM节点
    (fiber.effectTag & Placement) !== 0，即Fiber节点存在Placement effectTag

    我们知道，mount时，fiber.stateNode === null，且在reconcileChildren中调用的mountChildFibers不会为Fiber节点赋值effectTag。那  么首屏渲染如何完成呢？
    针对第一个问题，fiber.stateNode会在completeWork中创建，我们会在下一节介绍。
    第二个问题的答案十分巧妙：假设mountChildFibers也会赋值effectTag，那么可以预见mount时整棵Fiber树所有节点都会有Placement  effectTag。那么commit阶段在执行DOM操作时每个节点都会执行一次插入操作，这样大量的DOM操作是极低效的。
    为了解决这个问题，在mount时只有rootFiber会赋值Placement effectTag，在commit阶段只会执行一次插入操作。

beginWork流程图
    https://react.iamkasong.com/img/beginWork.png
