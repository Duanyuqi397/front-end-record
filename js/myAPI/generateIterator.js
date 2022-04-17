function generateIterator(arr){
    let nextIndex = 0;
    return {
        next : () => nextIndex < arr.length ? {
            value:arr[nextIndex++],
            done:false
        } : {
            value:undefined,
            done:true
        }
    }
}

const arr = generateIterator([1,2]);

console.log(arr.next());
console.log(arr.next());
console.log(arr.next());

const obj = {
    count:0,
    [Symbol.iterator]:() => {
        return {
            next:() => {
                obj.count++;
                if(obj.count < 10){
                    return {
                        value:obj.count,
                        done:false
                    }
                } else {
                    return {
                        value:undefined,
                        done:true
                    }
                }
            }
        }
    }
}

for(let item of obj){
    console.log(item)
}