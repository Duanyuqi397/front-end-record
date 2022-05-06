## Render阶段
    render阶段开始于performSyncWorkOnRoot/performConcurrentWorkOnRoot,这取决于本次更新是同步还是异步
```JavaScript
    //performSyncWorkOnRoot会调用这个方法
    function workLoopSync() {
        while (workInProgress !== null) {
            performUnitOfWork(workInProgress);
        }
    }

    // performConcurrentWorkOnRoot会调用该方法
    function workLoopConcurrent() {
        while (workInProgress !== null && !shouldYield()) {
            performUnitOfWork(workInProgress);
        }
    }
```
        区别在于是否调用shouldYield,当前浏览器帧没有剩余时间，会中止本次循环，等到浏览器有空闲时间再进行下一次循环
### render阶段又分为递阶段和归阶段
        递阶段：首先从rootFiber开始向下深度优先遍历，为遍历到的每个节点调用beginWork()，该方法会根据传入的fiber节点创建子节点，并将这两个节点连接起来，当遍历到叶子节点时，开始归阶段
        归阶段：归阶段会为fiber节点调用completeWork，当该节点执行完completeWork之后，会检查当前节点是否有兄弟节点(sibling),如果有，进入兄弟结点的递阶段，如果没有，即进入父级节点的归阶段，递和归会交错执行，直到归到rootFiber时，render阶段完成
```JavaScript
function App() {
  return (
    <div>
      i am
      <span>KaSong</span>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"));
```
    例如这个例子，render阶段的顺序是
```JavaScript
/*
1. rootFiber beginWork
2. App Fiber beginWork
3. div Fiber beginWork
4. "i am" Fiber beginWork
5. "i am" Fiber completeWork
6. span Fiber beginWork
7. span Fiber completeWork
8. div Fiber completeWork
9. App Fiber completeWork
10. rootFiber completeWork
*/
```
    之所以没有 “KaSong” Fiber 的 beginWork/completeWork，是因为作为一种性能优化手段，针对只有单一文本子节点的Fiber，React会特殊处理