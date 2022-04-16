//call/apply/myBind

function myCall(context=window,...args){
    let func = this;
    let fn = Symbol('fn');
    context[fn] = func;
    
    let res = context[fn](...args);//利用this指向，相当于context.caller(...args)

    delete context[fn];
    return res;
}

function myApply(context=window,args){
    let func = this;
    let fn = Symbol('fn');
    context[fn] = func;

    let res = context[fn](args);

    delete context[fn];
    return res;
}

function myBind(context,...args){
    let self = this;//保存this
    let f = function(){
        return self.apply(this instanceof f ? this : context || window,args.concat([].slice().call(arguments)));
    }
    f.prototype = Object.create(this.prototype);//保证原函数上的原型对象不会丢失
    return f;
}
