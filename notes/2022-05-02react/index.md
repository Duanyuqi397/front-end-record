1.Context
    在组件外部创建Context,const Context = createContext(),
    父组件在需要传递的组件外包裹<Context.Provider value={}>,
    子组件通过useContext()拿到数据并操作,子组件的子组件也可以，也就是说context可以实现跨组件传值
```JavaScript
import React,{ useState,useContext,createContext } from "react";

const Context = createContext();//在组件外部创建context

export const UseContext = () => {
    const [count,changeCount] = useState(0);
    const store = {
        count,changeCount
    }
    return (//在需要共享状态的组件外包裹
        <Context.Provider value={store}> 
            <button onClick={() => changeCount(count + 1)}>加一</button>
            <Sub1 />
        </Context.Provider>
    )
}

function Sub1(){
    const ctx = useContext(Context);//通过useContext即可拿到数据
    return (
        <div>
            <button onClick={() => ctx.changeCount(c => c + 2)}>Sub1能通过Context访问数据源 { ctx.count }</button>
            <Sub2 />
        </div>
    )
}

function Sub2(){
    const ctx = useContext(Context);
    return <p>Sub2拿到的数据 {ctx.count}</p>
}
```
2.Redux
    创建初始状态,
    通过一个reducer(state,action)纯函数来创建store,const store = createStore(reducer),
    将store导出,需要状态的组件引入store，修改状态需要通过store.dispatch({type,payload})
```JavaScript
//store.js
import { createStore } from 'redux';

const initialState = { count: 0 };

const reducer = function(state=initialState,action){
    switch(action.type){
        case 'ADD':{
            return { count: state.count + action.payload }
        }
        case 'DECREMENT':{
            return { count: state.count - action.payload }
        }
        default:
            return state;
    }
}

const store = createStore(reducer);
export default store;

//App.js
function App() {
  const [,update] = useState([]);
  const onAdd = () => {
    store.dispatch({type: 'ADD',payload: 2});
    update([]);
  }
  const onDec = () => {
    store.dispatch({type: 'DECREMENT',payload: 3});
    update([]);
  }
  return <>
        <button onClick={onAdd}>++ {store.getState().count}</button>
        <button onClick={onDec}>-- {store.getState().count}</button> 
      </>
```