## before mutation阶段
主要工作是遍历effectList并调用commitBeforeMutationEffects函数处理
### commitBeforeMutationEffects
大体代码逻辑
```JavaScript
function commitBeforeMutationEffects() {
  while (nextEffect !== null) {
    const current = nextEffect.alternate;

    if (!shouldFireAfterActiveInstanceBlur && focusedInstanceHandle !== null) {
      // ...focus blur相关
    }

    const effectTag = nextEffect.effectTag;

    // 调用getSnapshotBeforeUpdate
    if ((effectTag & Snapshot) !== NoEffect) {
      commitBeforeMutationEffectOnFiber(current, nextEffect);
    }

    // 调度useEffect
    if ((effectTag & Passive) !== NoEffect) {
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true;
        scheduleCallback(NormalSchedulerPriority, () => {
          flushPassiveEffects();
          return null;
        });
      }
    }
    nextEffect = nextEffect.nextEffect;
  }
}
```
整体可分为三部分：
    处理DOM节点渲染/删除后的 autoFocus、blur 逻辑
    调用getSnapshotBeforeUpdate生命周期钩子
    调度useEffect
##### 调度useEffect
主要是通过schedulerCallback方法以某个优先级异步调度一个回调函数，异步调度就是触发flushPassiveEffects方法
如何异步调度？
    整个useEffect异步调用分为三步：
    before mutation阶段在scheduleCallback中调度flushPassiveEffects，
    layout阶段之后将effectList赋值给rootWithPendingPassiveEffects，
    scheduleCallback触发flushPassiveEffects，flushPassiveEffects内部遍历rootWithPendingPassiveEffects
为什么要异步调度？
    useEffect异步调度主要是为了防止同步执行时阻塞浏览器渲染