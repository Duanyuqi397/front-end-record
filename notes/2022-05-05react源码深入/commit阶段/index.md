## commit阶段
Renderer工作的阶段称为commit阶段
起点
```JavaScript
commitRoot(root);
```
在rootFiber.firstEffect上保存了一条需要执行副作用的fiber节点的单向链表effectList，fiber节点的updateQueue中保存了变化的props
commit阶段主要就是在执行副作用，有一些生命周期钩子(componentDidXxx)和hook(useEffect)需要在commit阶段执行
commit阶段主要又分为before mutation,mutation和layout阶段，分别对应执行dom操作前，执行dom操作和执行dom操作后
在before mutation之前，还会做一些赋值，状态重置的工作
```JavaScript
// 将effectList赋值给firstEffect
  // 由于每个fiber的effectList只包含他的子孙节点
  // 所以根节点如果有effectTag则不会被包含进来
  // 所以这里将有effectTag的根节点插入到effectList尾部
  // 这样才能保证有effect的fiber都在effectList中
  let firstEffect;
  if (finishedWork.effectTag > PerformedWork) {
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    // 根节点没有effectTag
    firstEffect = finishedWork.firstEffect;
  }
```

## commit同步执行不会中断？
    因为needsPaint会在commitRoot中被调用
```JavaScript
shouldYield = function (){
    if(needsPaint || scheduling.inInputPending()){
        return true;
    }
}
```