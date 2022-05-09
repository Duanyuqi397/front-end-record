## 状态更新

### 从触发状态更新到render

**创建update对象**

触发状态更新的几种方法：

- this.setState
- useState
- useReducer
- this.forceUpdate
- ReactDOM.render

这些方法的使用场景不同，那么他们是如何接入同一套状态更新机制呢？

​	原因是每次状态更新都会创建一个**保存更新相关信息的对象Update**，在render阶段的beginWork里会根据Update计算出新的state

**调度更新**

现在拥有一个rootFiber，这个rootFiber对应的fiber树中包含了某个节点的Update，接下来会通知Scheduler根据该Update的优先级决定本次更新是用同步更新还是异步更新，调用的方法是ensureRootIsScheduled,核心代码如下：

```js
if (newCallbackPriority === SyncLanePriority) {
  // 任务已经过期，需要同步执行render阶段
  newCallbackNode = scheduleSyncCallback(
    performSyncWorkOnRoot.bind(null, root)
  );
} else {
  // 根据任务优先级异步执行render阶段
  var schedulerPriorityLevel = lanePriorityToSchedulerPriority(
    newCallbackPriority
  );
  newCallbackNode = scheduleCallback(
    schedulerPriorityLevel,
    performConcurrentWorkOnRoot.bind(null, root)
  );
}
```

其中，`scheduleCallback`和`scheduleSyncCallback`会调用`Scheduler`提供的调度方法根据`优先级`调度回调函数执行

```js
performConcurrentWorkOnRoot.bind(null, root);
performSyncWorkOnRoot.bind(null, root)
```

到此，调度更新和render阶段就连接上了