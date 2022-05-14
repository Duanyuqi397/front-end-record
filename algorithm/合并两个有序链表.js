/**
 * https://leetcode.cn/problems/merge-two-sorted-lists/
 * 思路
 * 实现方式，递归
 * 如果某一个链表为空，返回另一个链表
 * 依次比较两个链表中的节点，如果list1.val < list2.val，list1的后面拼接list1.next和list2比较，最后返回list1，以此类推
 */

 var mergeTwoLists = function(list1, list2) {
    if (list1 === null) {
        return list2;
    } else if (list2 === null) {
        return list1;
    } else if (list1.val < list2.val) {
        list1.next = mergeTwoLists(list1.next, list2);
        return list1;
    } else {
        list2.next = mergeTwoLists(list1, list2.next);
        return list2;
    }
};