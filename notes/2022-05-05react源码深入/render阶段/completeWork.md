## completeWork
    根据不同的fiber.tag实现，例如HostComponent，同样分为mount和update
### update
```JavaScript
if (current !== null && workInProgress.stateNode != null) {
  // update的情况
  updateHostComponent(
    current,
    workInProgress,
    type,
    newProps,
    rootContainerInstance,
  );
}
```
    当update时，fiber节点已经有对应的dom节点
    在updateHostComponent内部，没有处理完的props会被赋值给workInProgress.updateQueue,最终会在commit阶段渲染到页面上
```JavaScript
workInProgress.updateQueue = (updatePayload: any);
//其中updatePayload为数组形式，他的偶数索引的值为变化的prop key，奇数索引的值为变化的prop value
```  
### mount
    mount时的主要逻辑包括三个：
      为Fiber节点生成对应的DOM节点
      将子孙DOM节点插入刚生成的DOM节点中
      与update逻辑中的updateHostComponent类似的处理props的过程
    commit阶段如何通过一次插入dom操作，将整棵树渲染到页面上呢？
      原因就在于completeWork中的appendAllChildren方法:
        由于completeWork属于“归”阶段调用的函数，每次调用appendAllChildren时都会将已生成的子孙DOM节点插入当前生成的DOM节点下。那么当“归”到rootFiber时，我们已经有一个构建好的离屏DOM树
### effectList
    是一条单向链表
    effectList中第一个Fiber节点保存在fiber.firstEffect，最后一个元素保存在fiber.lastEffect。
    类似appendAllChildren，在“归”阶段，所有有effectTag的Fiber节点都会被追加在effectList中，最终形成一条以rootFiber.firstEffect为起点的单向链表
```JavaScript
                       nextEffect         nextEffect
rootFiber.firstEffect -----------> fiber -----------> fiber
```
    这样，在commit阶段，只需要遍历一次effectList就可执行完所有的effect了  

至此，render阶段工作已完成
completeWork流程图：https://react.iamkasong.com/img/completeWork.png 
