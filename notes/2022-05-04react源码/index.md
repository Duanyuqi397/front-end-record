17.0.2
## react迭代变化
    <= 15.0,react15之前的版本都是不可中断更新，Stack Reconciler，一旦发起更新，就必须更新完成才会结束（递归不能停）
    16.0,Fiber Reconciler,将任务细分之后提交给浏览器，实现可中断更新，commit阶段依然不可中断（同步任务）
    18.0,Concurrent Mode
## 目录结构
    react:公共代码，例如Component,PureComponent,CreateContext等基础API
    react-reconciler:协调器（核心）
    react-dom:跑在浏览器里面的渲染器
    scheduler:调度器,包含SchedulerPriorities(优先级调度)，SchedulerMinHeap(最小堆调度算法)等
## react解决的问题
    CPU瓶颈：js是单线程的，而js执行和页面渲染的进程又是互斥的，如果js执行时间较长，主线程就会卡顿，严重影响交互体验。
        react如何解决？在浏览器的每一帧执行时间里，预留5ms给js线程，react利用这部分时间进行组件更新，时间不够用时，将控制权交回给浏览器，react等待下一帧来继续进行被中断的工作。所以，解决这个问题的关键是时间切片，时间切片的关键是：异步可中断更新
    IO瓶颈：React实现了Suspense (opens new window)功能及配套的hook——useDeferredValue，内部也是通过异步可中断更新实现
## react中的数据结构
    二进制位运算：
        为什么不用数字运算而是用二进制？
            二进制运算效率高，提高性能，react中状态/类型/优先级的组合比较等操作都是通过位运算
    深度优先遍历：将代码转换成FiberNode的时候采用的深度优先遍历，深度优先遍历树，生成链表
    FiberNode是一个链表，关键属性：
```JavaScript
    //Instance
    this.tag = tag;//当前的fiber类型，有ClassComponent,FunctionComponent,HostComponent
    this.key = key;//组件中的key，用于diff
    this.stateNode = null;//fiber的实例，类组件指向的是组件实例，HostComponent指向的是dom元素
    //Fiber 链表
    this.return = null;//指向父级fiber
    this.sibling = null;//指向兄弟fiber
    this.child = null;//指向子级fiber
    this.index = 0;
    this.ref = null;//ref相关
    //更新相关的
    this.pendingProps = pendingProps;//将要执行的更新的属性
    this.memoizedProps = null;//上一次更新的props
    this.updateQueue = null;//更新队列
    this.memoizedState = null;//上一次更新的state
    //模式相关
    this.mode = mode;//StrictMode,ConcurrentMode...
    //Effects
    this.flags = NoFlags;//当前fiber节点需要执行的操作，包括占位、更新、删除等
    this.nextEffect = null;//单向链表用来快速查找下一个side effect
    this.firstEffect = null;//子树中的第一个side effect
    this.lastEffect = null;//子树中的最后一个side effect
    //优先级相关
    this.lanes = NoLanes;//表示当前节点是否需要更新
    this.childLanes = NoLanes;//表示子节点是否需要更新
    //workInProgress中的节点和current节点相关联的属性
    this.alternate = null;
```
    为什么用链表？
        链表相对于数组等数据结构能够更方便且高效地进行更新，删除等操作
    lane：31位二进制表示，有组合优先级和单独优先级，lane数值越大优先级越低