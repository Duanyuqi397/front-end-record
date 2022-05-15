/**
 * https://leetcode.cn/problems/binary-tree-inorder-traversal/submissions/
 * 思路
 * 中序遍历，左根右的顺序，用递归
 * 从根节点开始，先找左子树，数组存val
 * 左子树找完，即!root,直接return，然后右子树里边继续找 
 */

var inorderTraversal = function (root) {
    let res = [];
    const inorder = (root) => {
        if (!root) return;
        inorder(root.left);
        res.push(root.val);
        inorder(root.right);
    }
    inorder(root);
    return res;
};

