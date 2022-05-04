/** https://leetcode-cn.com/problems/path-sum/
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {boolean}
 */

/** 给你二叉树的根节点 root 和一个表示目标和的整数 targetSum 。判断该树中是否存在 根节点到叶子节点 的路径，这条路径上所有节点值
 * 相加等于目标和 targetSum 。如果存在，返回 true ；否则，返回 false 。叶子节点 是指没有子节点的节点。
 * 思路：
 * 根据题目意思，选择深度优先遍历
 * 递归终止条件：当前节点的值等于targetSum
 * 递归左右子树，传入当前val和targetSum的差值即可
 */

 var hasPathSum = function(root, targetSum) {
    if(!root) return false;
    if(!root.left && !root.right && root.val === targetSum) return true;
    return hasPathSum(root.left,targetSum - root.val) || hasPathSum(root.right,targetSum - root.val);
};