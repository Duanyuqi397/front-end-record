/**
 * @param {ListNode} head
 * @return {boolean}
 */

/** 思路
 * 判断链表是否有环，通过快慢指针进行判断
 * 因为快指针一次走两步 慢指针一次走一步 如果链表没有环 快指针会走到头 所以while的终止条件是快指针走到头
 * 如果有环 while不会停止 终止条件即是快慢指针相遇
 */

 var hasCycle = function(head) {
    let fast = head,slow = head;
    while(fast && fast.next){
        fast = fast.next.next;
        slow = slow.next;
        if(fast == slow) return true;     
    }
    return false;
};