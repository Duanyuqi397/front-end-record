import React,{ useState,useEffect } from "react";

let stateArray = [];//维护全局的状态列表和游标，如果放在函数里，每次执行都会重置，所以要全局
let cursor = 0;

function useStateMock(initialState){
    const currentCursor = cursor;//获取当前游标
    stateArray[currentCursor] = stateArray[currentCursor] || initialState;//如果state存在，直接用，不存在则使用初始值

    function setState(newState){//setState
        stateArray[currentCursor] = newState;
        // render();
    }

    ++cursor;//执行完当前state之后，往后移

    return [stateArray[currentCursor],setState];//返回state和setState
}