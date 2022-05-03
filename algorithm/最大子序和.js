/**
 * @param {number[]} nums
 * @return {number}
 */

/** 思路
 * 涉及负数 滑动窗口法不好规定移动，故用动态规划
 * 每一次遍历 比较当前数为结尾的序列相对于上一个数为结尾的序列是否是正增益 如果是 那么当前这个数可以加入到上一个数为结尾的序列
 * 最后返回maxAns
 */
var maxSubArray = function(nums) {
    let pre = 0,maxAns = nums[0];
    nums.forEach((x) => {
        pre = Math.max(pre + x,x);
        maxAns = Math.max(maxAns,pre)
    })
    return maxAns;
};

console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))