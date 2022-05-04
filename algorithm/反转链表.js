/**
 * @param {ListNode} head
 * @return {ListNode}
 */

/** 思路
 * 递归反转，终止递归的条件是当节点不存在或者节点的next不存在时，停止递归
 * 反转逻辑：head.next.next = head;head.next = null;
 * 最后返回递归的结果
 */

 var reverseList = function(head) {
    if(!head || !head.next) return head;

    const newHead = reverseList(head.next);
    head.next.next = head;
    head.next = null;
    return newHead
};