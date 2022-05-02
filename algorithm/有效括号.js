/**
 * https://leetcode-cn.com/problems/valid-parentheses/
 * @param {string} s
 * @return {boolean}
 */

/** 解题思路
 * map用来存储每个括号的映射关系，通过右括号找左括号
 * 用一个栈来存储是否有对应的括号
 * 如果遍历的时候，遍历到右括号，需要到栈中找是否有与之对应的左括号，如果找到了则弹出栈顶元素，遍历到左括号则入栈
 * 最后如果栈的长度为0，说明全部匹配成功
 */

 var isValid = function(s) {
    if(!s.length) return true;
    if(s.length % 2) return false;
    let map = new Map([
        [')','('],
        ['}','{'],
        [']','[']
    ]);
    let stk = [];
    for(let char of s){
        if(map.has(char)){
            if(!stk.length || stk[stk.length - 1] !== map.get(char)){
                return false;
            } 
            stk.pop();
        } else {
            stk.push(char);
        }
    }
    return !stk.length;
};