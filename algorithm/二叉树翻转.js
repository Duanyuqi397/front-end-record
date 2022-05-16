/**
 * https://leetcode.cn/problems/invert-binary-tree/
 * 思路
 * 递归，将每一层的左右子树交换即可
 */

 var invertTree = function(root) {
    if(!root) return null;
    const left = invertTree(root.left);
    const right = invertTree(root.right);
    root.left = right;
    root.right = left;
    return root;
};