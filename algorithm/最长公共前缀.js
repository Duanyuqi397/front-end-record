/**
 * https://leetcode.cn/problems/longest-common-prefix/
 * 思路
 * 因为是公共前缀，所以取其中一个字符串和其他进行对比
 * 两层循环，第一层遍遍历数组的每一个字符串，第二层遍历每一个字符串的每一个字符和取出来的字符串的每一个字符
 * 第二层循环条件是j要小于目标字符串的长度，i也要小于数组长度
 * 如果字符串中某个字符不相等，直接break，将目标字符串截取前面的，如果截取之后长度为0说明没有公共前缀
 * 最后return res
 */

 var longestCommonPrefix = function(strs) {
    if(!strs.length) return "";
    let res = strs[0];
    for(let i = 0;i < strs.length;i++){
        let j = 0;
        for(;j < res.length && i < strs.length;j++){
            if(res[j] !== strs[i][j]) break;
        }
        res = res.substr(0,j);
        if(!res.length) return "";
    }
    return res;
};