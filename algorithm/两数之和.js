/**
 * https://leetcode-cn.com/problems/two-sum/
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */

/** 思路
 * 用map存储值和下标
 * 当target和当前值的差在map中存在，说明已经有一个值+当前值==target，直接返回一个包含值和当前的下标的数组即可
 * 如果map中没有，说明没有找到，把当前值set进去，后续查找
 */

 var twoSum = function(nums, target) {
    let map = new Map();
    for(let i in nums){
        if(map.has(target - nums[i])){
            return [map.get(target - nums[i]),i];
        } else {
            map.set(nums[i],i);
        }
    }
    return []
};