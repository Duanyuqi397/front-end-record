// function myDebounce(fn,delay){
//     let timer = null;
//     return function(){
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//             fn()
//         },delay);
//     }
// }

function A(config) {
    config.age = 20
    return config
  }
  function B(config) {
    config.city = '上海'
    return config
  }
  function C(config) {
    config.company = '再惠'
    return config
  }

function compose(...funcs){
    let len = funcs.length;
    let result;
    let count = len - 1;
    return  function fn(...args){
        result = funcs[count].apply(this,args);
        if(count < 0){
            return result;
        }
        count--;
        return fn(result);
    }
}

console.log(compose(A, B, C)({ name: 'demo' }))

// function fb(n){
//     if(n <= 0){
//         return 0;
//     }
//     if(n == 1 ){
//         return 1;
//     }
//     // if(n == 2){
//     //     return 3;
//     // }
//     return fb(n - 1) + fb(n - 2);
// }

// console.log(fb(10))