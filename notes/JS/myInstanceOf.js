//instanceOf

function myInstanceOf(left,right){//递归往上查找
    let proto = Object.getPrototypeOf(left);
    while(1){
        if(proto == null) return false;
        if(proto == right.prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
}

let f = function(){};
console.log(myInstanceOf(f,Array))