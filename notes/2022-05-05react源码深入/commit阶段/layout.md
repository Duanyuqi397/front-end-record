## layout阶段
    在mutation完成后，layout完成前，进行current fiber树切换
```JavaScript
root.current = finishedWork;
```
先将current fiber树切换，生命周期钩子获取到的dom才是更新后的

useLayoutEffect和useEffect的区别？
    mutation阶段会执行useLayoutEffect hook的函数销毁，而useLayoutEffect hook从上次更新的销毁函数调用本次更新的回调函数是同步执行的，而useEffect需要先调度(before mutation阶段调度)，在layout阶段结束之后异步执行，这就是区别