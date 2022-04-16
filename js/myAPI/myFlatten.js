//数组打平

//1.原生flat
let ary = [1, [2, [3, [4, 5]]], 6];
let res = ary.flat(Infinity)
console.log(res)

//2.递归
let result = []
function f(ary){
    for(let i = 0;i < ary.length;i++){
        let item = ary[i];
        if(item instanceof Array){
            f(item)
        }else{
            result.push(item)
        }
    }
}
f(ary)
console.log(result)

//3.reduce+concat
function myFlatten(ary){
    return ary.reduce((pre,cur) => {
        return pre.concat(Array.isArray(cur) ? myFlatten(cur) : cur)
    },[])
}
console.log(myFlatten(ary))