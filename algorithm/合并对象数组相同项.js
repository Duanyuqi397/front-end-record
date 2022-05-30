/**
 * 思路：
 * 用一个新的数组存储结果
 * 每一轮遍历用一个prevItem保存当前的遍历项
 * 如果结果数组里面有数据，那就过滤出type和当前相同的项，value相加
 * 过滤之后没有和当前item的type相同的项，则直接push
 */

function mergeArr(arr) {
    let res = [];
    arr.forEach(item => {
        let prevItem = item
        if (res.length > 0) {
            let filterValue = res.filter(v => {
                return v.type == prevItem.type
            })
            if (filterValue.length > 0) {
                res.forEach(i => {
                    if (i.type === filterValue[0].type) {
                        i.value = filterValue[0].value + prevItem.value
                    }
                })
            } else {
                res.push(prevItem)
            }
        } else {
            res.push(prevItem)
        }

    })
    return res;
}

let arr = [{ type: 'a', value: 1 }, { type: 'b', value: 2 }, { type: 'a', value: 3 }, { type: 'b', value: 4 }];
console.log(mergeArr(arr))//[ { type: 'a', value: 4 }, { type: 'b', value: 6 } ]

let arr2 = [{type: 'dyq',value: 100},{ type: 'qwe',value: 100 },{ type: 'asd',value: 1 },{type:'dyq',value: 200},{type: 'asd',value:-1}]
console.log(mergeArr(arr2))
/**
 * [
  { type: 'dyq', value: 300 },
  { type: 'qwe', value: 100 },
  { type: 'asd', value: 0 }
]
 */