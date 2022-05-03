/**
 * @param {number} n
 * @return {number}
 */

/** 思路
 * 思路等同于斐波那契 只是初始值不同
 */
 var climbStairs = function(n) {
    const dp = [];
    dp[0] = 1;
    dp[1] = 1;
    for(let i = 2;i <= n;i++){
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
};