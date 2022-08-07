/**
 *  @description
 *  用链表实现队列，优于数组
 */

// 双栈结构 
var CQueue = function () {
  this.inStack = [];
  this.outStack = [];
};

CQueue.prototype.appendTail = function (value) {
  this.inStack.push(value);
};

CQueue.prototype.deleteHead = function () {
  if (!this.outStack.length) {
    if (!this.inStack.length) {
      return -1;
    }
    this.in2out();
  }
  return this.outStack.pop();
};

CQueue.prototype.in2out = function () {
  while (this.inStack.length) {
    this.outStack.push(this.inStack.pop());
  }
}