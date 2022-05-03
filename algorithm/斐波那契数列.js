/**
 * @param {number} n
 * @return {number}
 */

/** 思路
 * 当n为0和1的时候 是固定的 
 * 当n为2开始 每一次的结果都是上一次
 * 递推公式dp[i] = dp[i - 1] + dp[i - 2]
 */
 var fib = function(n) {
    const dp = [0,1];
    for(let i = 2;i <= n;i++){
        dp[i] = (dp[i - 1] + dp[i - 2]) % 1000000007;
    }
    return dp[n];
};