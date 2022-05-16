/**
 * https://leetcode.cn/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/
 * 思路
 * 链表无法直接拿到长度，所以遍历一遍，用变量记录长度
 * 倒数第k个节点其实就是整个链表去掉前面一段(长度减去k)之后，剩下的链表
 */

 var getKthFromEnd = function(head, k) {
    let len = 0,res = head;
    while(res){
        res = res.next;
        len++;
    }
    res = head;
    for(let i = 0; i < len - k;i++){
        res = res.next;
    }
    return res;
};