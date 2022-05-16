/**
 * https://leetcode.cn/problems/binary-tree-preorder-traversal/ 
 */
var preorderTraversal = function(root) {
    let res = [];
    const frontOrder = (root) => {
        if(!root) return;
        res.push(root.val);
        frontOrder(root.left);
        frontOrder(root.right);
    }
    frontOrder(root);
    return res;
};