/**
 * @param {number} n
 * @return {number}
 */

//同爬楼梯和斐波那契

 var numWays = function(n) {
    let dp = [1,1];
    for(let i = 2; i <= n;i++){
        dp[i] = (dp[i - 1] + dp[i - 2]) % 1000000007;
    }
    return dp[n];
};