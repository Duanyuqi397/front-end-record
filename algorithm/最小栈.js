/**
 * https://leetcode.cn/problems/min-stack/
 * 两个栈，push的时候处理最小的那个栈对比栈顶元素和当前值即可
 */

 var MinStack = function(){
    this.x_stack = [];
    this.min_stack = [Infinity];
}

MinStack.prototype.push = function(x){
    this.x_stack.push(x);
    this.min_stack.push(Math.min(this.min_stack[this.min_stack.length - 1],x));
}

MinStack.prototype.pop = function(){
    this.x_stack.pop();
    this.min_stack.pop();   
}

MinStack.prototype.top = function(){
    return this.x_stack[this.x_stack.length - 1];
}

MinStack.prototype.getMin = function(){
    return this.min_stack[this.min_stack.length - 1];
}


/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(val)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */