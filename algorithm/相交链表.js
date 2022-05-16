/**
 * https://leetcode.cn/problems/intersection-of-two-linked-lists/
 * 思路
 * 双指针，两个链表一起移动，当其中一个走完时，接着走下一个，如果两个链表有交点，一定会相遇
 */

 var getIntersectionNode = function(headA, headB) {
    if (!headA || !headB) return null;
    let pA = headA,
        pB = headB;
    while (pA !== pB) {
        pA = pA === null ? headB : pA.next;
        pB = pB === null ? headA : pB.next;
    }
    return pA;
};