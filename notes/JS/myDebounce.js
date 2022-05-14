//防抖

function myDebounce(fn,delay){
    let timer = null;
    return (...args) => {
        clearTimeout(timer);//调用时清零
        timer = setTimeout(() => {
            fn.apply(this,args);//重新绑定回调并设置延时
        },delay)
    }
}