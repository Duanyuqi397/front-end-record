const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
    fulFilledCallbackList = [];
    rejectedCallbackList = [];

    _status = PENDING;

    constructor(fn){
        this.status = PENDING;
        this.value = null;
        this.reason = null;

        try {
            fn(this.resolve.bind(this),this.reject.bind(this));
        } catch (e) {
            this.reject(e);
        }
    }

    get status(){
        return this._status;
    }

    set status(newStatus){
        this._status = newStatus;
        switch (newStatus) {
            case FULFILLED: {
                this.fulFilledCallbackList.forEach(cb => {
                    cb(this.value);
                });
                break;
            }
            case REJECTED: {
                this.rejectedCallbackList.forEach(cb => {
                    cb(this.reason);
                });
                break;
            }
        }
    }

    resolve(value){
        if(this.status === PENDING){
            this.status = FULFILLED;
            this.value = value;
        }
    }

    reject(reason){
        if(this.status === PENDING){
            this.status = REJECTED;
            this.reason = reason;
        }
    }

    static resolve(value){
        if(value instanceof MyPromise){
            return value;
        }
        return new MyPromise(resolve => {
            resolve(value);
        })
    }

    static reject(reason){
        return new MyPromise((resolve, reject) => {
            reject(reason);
        })
    }

    then(onFulfilled, onRejected){
        const realOnFulfilled = this.isFunction(onFulfilled) ? onFulfilled : (value) => value;
        const realOnRejected = this.isFunction(onRejected) ? onRejected : (reason) => {
            throw reason;
        }

        const newPromise = new MyPromise((resolve, reject) => {

            const fulfilledMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const res = realOnFulfilled(this.value);
                        this.resolvePromise(newPromise, res, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })
            }

            const rejectedMicrotask = () => {
                queueMicrotask(() => {
                    try {
                        const res = realOnRejected(this.reason);
                        this.resolvePromise(newPromise, res, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                })
            }

            switch(this.status){
                case FULFILLED: {
                    fulfilledMicrotask();
                    break;
                }
                case REJECTED: {
                    rejectedMicrotask();
                    break;
                }
                default: {
                    this.fulFilledCallbackList.push(fulfilledMicrotask);
                    this.rejectedCallbackList.push(rejectedMicrotask);
                }
            }
        });
        return newPromise;
    }

    catch(onRejected){
        return this.then(null, onRejected);
    }

    resolvePromise(newPromise, res, resolve, reject){
        if(newPromise === res){
            return reject(new TypeError("The promise and the return value are the same!"));
        }

        if(res instanceof MyPromise){
            queueMicrotask(() => {
                res.then(res => {
                    this.resolvePromise(newPromise, res, resolve, reject);
                }, reject)
            })
        } else if(typeof res === 'object' || this.isFunction(res)) {
            if(res === null){
                resolve(res);
            }

            let then = null;

            try {
                then = res.then;
            } catch (e) {
                return reject(e);
            }

            if(this.isFunction(then)){
                let called = false;
                try {
                    then.call(
                        res,
                        (res) => {
                            if(called) return;
                            called = true;
                            this.resolvePromise(newPromise, res, resolve, reject);
                        },
                        (rej) => {
                            if(called) return;
                            called = true;
                            reject(rej);
                        }
                    )
                } catch (e) {
                    if(called) return;
                    reject(e);
                }
            } else {
                resolve(then);
            }

        } else {
            resolve(res);
        }
    }

    isFunction(param){
        return typeof param === 'function';
    }
}

// const test = new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(11111)
//     },1000);
// }).then((value) => {
//     return value;
// })

// console.log(test);

// setTimeout(() => {
//     console.log(test)
// },2000)

const test = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        reject(11111);
    }, 1000)
}).catch((reason) => {
    console.log(`报错` + reason);
    console.log(test);
})

setTimeout(() => {
    console.log(test);
}, 3000);