/** 
 * https://leetcode.cn/problems/maximum-depth-of-binary-tree/
 * 思路
 * 递归 终止条件是当前节点为叶子节点时
 * 用left和right分别保存左右子树的递归返回
 * 最后取大的一个+1
 */

var maxDepth = function(root) {
    if(!root) return 0;
    else {
        const left = maxDepth(root.left);
        const right = maxDepth(root.right);
        return Math.max(left,right) + 1;
    }
};