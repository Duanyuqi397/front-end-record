function myMap(fn,arr=[]){
    if(typeof fn !== 'function'){
        throw new Error(`${fn} is not a function`)
    }
    return arr.reduce((pre,cur,index,list) => {
        return pre.concat(fn.call(arr,cur,index,list));
    },[]);
}

const arr = [1,2,3];
console.log(myMap(item => item * 2,arr));