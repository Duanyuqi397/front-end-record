/**
 * 假设有如下字符串“A12”，其中“A”表示数据类型（A-Z），“12”表示数据序号（0-9）。
 * 现在需要对一组数据先按照数据序号再按照数据类型进行排序。
 * 例如：["B3","D2","F1","A9","D12","A2","C1","Z0","B1"]=>["Z0","B1","C1","F1","A2","D2","B3","A9","D12"]
 * 
 */

const test = ["B3","D2","F1","A9","D12","A2","C1","Z0","B1"];

function dataSort(ary){
    let sortedByChar = ary.sort();

    let splitAry = [];
    sortedByChar.forEach(item => {
        splitAry.push({char: item.slice(0,1),number: item.slice(1)});
    });

    function compareByNumber(value){
        return function(a,b){
            return a[value] - b[value];
        }
    }
    let sortedByNumber = splitAry.sort(compareByNumber('number'));

    let keyAndValue = [];
    sortedByNumber.forEach(item => {
        keyAndValue.push(Object.values(item));    
    })

    let flatted = keyAndValue.flat(Infinity);

    let res = [];
    for(let i = 0;i < flatted.length;i++){
        res.push(flatted[i] + flatted[i + 1]);
        i++;
    }

    return res;
}

let res = dataSort(test);
console.log(res);//['Z0', 'B1', 'C1','F1', 'A2', 'D2','B3', 'A9', 'D12']