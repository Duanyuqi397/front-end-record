/**
 * https://leetcode.cn/problems/binary-search/
 * 思路
 * 有序数组，确定用二分，左边界小于等于右边界是循环条件
 * 跳出循环的条件是左右边界已经不能收缩了/找到了target
 * let mid = Math.floor((right - left) / 2) + left;二分法标准取中间值方法
 */

 var search = function(nums, target) {
    let left = 0,right = nums.length - 1;
    while(left <= right){
        let mid = Math.floor((right - left) / 2) + left;
        if(nums[mid] > target){
            right = mid - 1;
        }else if(nums[mid] < target){
            left = mid + 1;
        }else{
            return mid;
        }
    }
    return -1;
};