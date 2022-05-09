## Update

首先，将可以触发更新的方法所隶属的组件分类：

- ReactDOM.render —— HostRoot
- this.setState —— ClassComponent
- this.forceUpdate —— ClassComponent
- useState —— FunctionComponent
- useReducer —— FunctionComponent

可以看到一共分为三种分类(HostRoot/FunctionComponent/ClassComponent)

由于不同类型组件工作方式不同，所以存在两种不同结构的`Update`，其中`ClassComponent`与`HostRoot`共用一套`Update`结构，`FunctionComponent`单独使用一种`Update`结构

这里以前一种Update为例

**Update的结构**

ClassComponent与HostRoot（即rootFiber.tag对应类型）共用一种Update结构

结构如下：

```js
const update: Update<*> = {
  eventTime,//任务的时间，通过performance.now获取的毫秒数
  lane,//优先级相关字段
  suspenseConfig,//suspense相关
  tag: UpdateState,//更新的类型，UpdateState | ReplaceState | ForceUpdate | CaptureUpdate
  payload: null,//更新挂载的数据
  callback: null,//更新的回调
  next: null,//与其他Update相连形成链表
};
```

**Update与Fiber**

Fiber节点上的多个Update会形成链表并保存在updateQueue中

**什么情况下一个fiber节点会存在多个Update？**

```js
onClick(){
    this.setState({
        a:1
    })
    this.setState({
        b:1
    })
}
```

`Fiber节点`最多同时存在两个`updateQueue`：

- `current fiber`保存的`updateQueue`即`current updateQueue`
- `workInProgress fiber`保存的`updateQueue`即`workInProgress updateQueue`

在`commit阶段`完成页面渲染后，`workInProgress Fiber树`变为`current Fiber树`，`workInProgress Fiber树`内`Fiber节点`的`updateQueue`就变成`current updateQueue`

**updateQueue**

`ClassComponent`与`HostRoot`使用的`UpdateQueue`结构如下：

```js
const queue: UpdateQueue<State> = {
    baseState: fiber.memoizedState,//本次更新的fiber节点的state
    firstBaseUpdate: null,//firstBaseUpdate与lastBaseUpdate，本次更新前该节点已经保存的Update，以链表形式存在，在更新前某些节点就存在update是因为某些update在上一次更新时被更高优先级的update打断，导致render阶段计算update时被跳过
    lastBaseUpdate: null,
    shared: {
      pending: null,//触发更新时，产生的update会保存在shared.pending中，形成单项环状链表，当由update计算state时会被剪开并拼接到lastBaseUpdate后面
    },
    effects: null,//数组，保存update.callback !== null的节点
  };
```

shared.pending` 会保证始终指向最后一个插入的`update

shared.pending`指向最后一个`pending`的`update