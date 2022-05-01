1.useState：状态管理，const [xxx,setXxx] = useState(initialState);
    setXxx：如果只需要一个状态，而不需要改变状态的方法，可以不写，但这样的话不如使用useRef
    useState只是在第一次执行的时候使用初始值(只在第一次生效)，后续执行都是返回[xxx,setXxx]

    useState和class组件中的this.setState的不同？
        前者是不断替换新的状态，后者是进行合并

    useState的结果为什么使用数组来接收？


sample:
```JavaScript
import React,{ useState,useEffect } from "react";

export const Counter = () => {
    const [count,setCount] = useState(0);

    useEffect(() => {
        document.title = `你点击了${count}次`
    },[count])

    return <div>
        <p>你点击了{count}次</p>
        <button onClick={() => setCount(count + 1)}>点击</button>
    </div>
}
```

2.useEffect：副作用管理，useEffect(()=>{},[deps])
    执行时机：在每次渲染完成之后执行effect，包括第一次
    在每次依赖项发生变化时，触发副作用
    当依赖项为[]时，本次渲染中只执行一次
    当没有依赖项时，只要本组件更新，都会触发(也可能是父组件更新导致的本组件更新)
    当依赖项为引用类型时，即使依赖项不发生变化，也会执行，因为useEffect进行浅比较
    不需要清理的side effects：网络请求，手动修改DOM，日志记录等
    需要手动清理的side effects：例如，我们可能希望设置对某些外部数据源的订阅
    return：在副作用执行完毕后，清理副作用，在组件卸载时执行，例如：在deps发生变化时，添加一个监听事件，执行完成之后(或者某种条件下)，移除监听

    为什么要在组件内调用useEffect?
        在组件内调用，可以直接读取到组件内的props,state等，这些数据已经在函数的作用域中了

3.hook不能放在条件判断里？
    因为react将注册的hook放在一条单向链表里，执行顺序是一定的，如果将hook放在条件判断里，当某个条件下不能产生变化的时候，会将影响之后的hook的执行

4.实现一个简易useState
```JavaScript
let stateArray = [];//维护全局的状态列表和游标，如果放在函数里，每次执行都会重置，所以要全局
let cursor = 0;

function useStateMock(initialState){
    const currentCursor = cursor;//获取当前游标
    stateArray[currentCursor] = stateArray[currentCursor] || initialState;//如果state存在，直接用，不存在则使用初始值

    function setState(newState){//setState
        stateArray[currentCursor] = newState;
        // render();//在短时间内去set多次，会进行合并   
    }

    ++cursor;//执行完当前state之后，往后移

    return [stateArray[currentCursor],setState];//返回state和setState
}
```

5.useRef
    const container = useRef(false),通过useRef创建返回的对象是持久化的，不会因为组件的更新而改变，等同于类组件的this
    可用于引用dom节点进行操作，也可以充当持久化数据对象

6.useCallback useMemo memo
    useCallback和useMemo用于缓存函数，useMemo是返回函数执行后的结果，useCallback是返回函数
    memo第一个参数是函数，函数的props变化会重新渲染，第二个参数是对应的规则，例如(prev,next) => prev.value === next.value，当value相同的时候缓存，即不必重复渲染
```JavaScript
import React, { memo, useCallback, useState } from "react";

export default function UseCallback(){
    const [count,setCount] = useState(0);
    const [value,setValue] = useState(0);

    const onClick = () => {
        // console.log('parent');
        setCount(count + 1);
    }

    const onChange = useCallback( e => {
        // console.log('sub');
        setValue(e.target.value)
    },[count])//如果count发生变化 虽然子组件没有用到count 但是onChange在子组件里面重新创建了 所以子组件也会重新渲染

    return (
        <div>
            <button onClick={onClick}>count发生变化 {count}</button>
            <UseCallbackSub onChange={onChange} value={value} />
        </div>
    )
}

const UseCallbackSub = memo(({ onChange,value }) => {
    console.log('子元素渲染',value)
    return <input type="number" onChange={onChange} value={value} />;
},(prev,next) => prev.value === next.value)
```

7.高阶组件
    其实就是一个函数，传入一个组件，返回装饰后的该组件，KForm.js
    可用于上报错误，组件日志等功能

8.遇到的问题
    在useCallback练习中，发现子组件只要渲染，必定会打印两次，尽管我的父子组件之间已经用useCallback正确的控制了缓存函数，查阅文档发现是react的严格模式导致的，StrictMode中的douvle invoking只会在dev发生，而不会在生产环境中发生，因为react想要在编写的时候尽量多的暴露问题，解决办法：App.js中去掉<StrictMode>的包裹即可
    链接：https://stackoverflow.com/questions/61254372/my-react-component-is-rendering-twice-because-of-strict-mode
        https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects