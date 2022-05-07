## Scheduler（调度器）
    既然浏览器是以一帧内是否有剩余时间作为是否中断的标准，那就需要有一种机制，在浏览器有剩余时间的时候进行通知，部分浏览器已经实现了这个API,就是requestIdleCallback,但是由于以下原因，react放弃了使用：
        1.浏览器兼容性
        2.触发频率不稳定，受很多因素影响，比如切换了浏览器的tab时，之前的requestIdleCallback的触发频率就会变得很低
    基于这两点，react实现了自己的requestIdleCallback polyfill,那就是Scheduler
## Reconciler（协调器）
    在react16中的Reconciler已经不是递归处理vdom了，而是可中断的循环，每次循环都会通过shouldYield来判断是否有剩余时间。
    Fiber架构即是在Reconciler中实现的
    如何解决中断更新不完整的问题？
        当Scheduler将任务交给Reconciler之后，Reconciler会为变化的vdom节点打上代表增删改的标记，整个Scheduler与Reconciler的工作都在内存中进行。只有当所有组件都完成Reconciler的工作，才会统一交给Renderer。
    Reconciler为什么没有采用Generator实现？
        如果只考虑单一优先级任务的可中断，Generator可以很好的实现异步可中断更新，但是如果遇到高优先级任务插队的情况下，是有问题的：因为Generator的执行过程中，上下文是关联的，如果中断后继续，需要重新执行，所以react没有采用Generator
    什么是fiber？
        fiber的中文翻译叫做纤程，它可以理解为协程的一种实现，而在js中，协程的实现是Generator，在react中，fiber就是实现一套状态更新的机制，支持不同的任务优先级，可中断与恢复，并且恢复之后可以复用之前的状态
    fiber的工作原理？
        在内存中构建fiber树，对应dom树的创建与更新，
        双缓存fiber树：在react中最多会同时存在两棵树，一个是内存中的workInProgress Fiber树，另外一个是屏幕上看到的current Fiber树，他们通过alternate连接，即：
```JavaScript
    current.alternate = workInProgress;
    workInProgress.alternate = current;
```
        react应用根节点通过改变current指向，在不同rootFiber之间切换来完成更新。
react创建并构建fiber树分为两个阶段

## react如何实现requestIdleCallback？
    通过messageChannel(宏任务)，因为宏任务是在下次事件循环中执行，不会阻塞本次页面更新。而微任务是在本次页面更新前执行，与同步执行无异，不会让出主线程
    为什么不用setTimeout(fn, 0) ？因为setTimeout不可以在两个任务间通信，而且递归执行 setTimeout(fn, 0) 时，最后间隔时间会变成 4 毫秒，而不是最初的 1 毫秒
