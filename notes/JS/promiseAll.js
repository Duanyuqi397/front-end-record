function promiseAll(promiseList) {
    //传入promise的数组
    if (!Array.isArray(promiseList)) {
        throw new Error('error')
    }
    //results用于保存每一个结果
    let results = [];
    //count记录执行情况，count===len的时候就应该把整个results resolve出来
    let count = 0;
    let len = promiseList.length;
    //返回一个promise
    return new Promise((resolve, reject) => {
        promiseList.forEach((item, index) => {
            Promise.resolve(item).then(res => {
                count++;
                results[index] = res;
                if (count === len) {
                    return resolve(results);
                }
            }, (err) => {
                reject(err);
            })
        });
    });
}

function fn1() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
        }, 2000);
    })
}

function fn2() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(2)
        }, 1000);
    })
}

promiseAll([fn1(), fn2()])
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
})