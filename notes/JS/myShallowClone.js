function myShallowClone(source){
    let target = {};
    for(let i in source){
        if(source.hasOwnProperty(i)){
            target[i] = source[i];
        }
    }
    return target;
}

var a1 = {b: {c: {}}};

var a2 = myShallowClone(a1); // 浅拷贝
console.log(a2.b.c === a1.b.c) // true
