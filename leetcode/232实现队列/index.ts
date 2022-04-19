/**
 * Your MyQueue object will be instantiated and called as such:
 * var obj = new MyQueue()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.peek()
 * var param_4 = obj.empty()
 */

export class MyQueue {
  private stack1: unknown[];
  private stack2: unknown[];

  constructor() {
    this.stack1 = [];
    this.stack2 = [];
  }

  /**
   * 入队
   * @param {number} x
   * @return {void}
   */
  push(x: unknown) {
    this.stack1.push(x);
  }

  /**
   * 出队
   * @return {number}
   */
  pop() {
    let res: unknown;
    const stack1 = this.stack1;
    const stack2 = this.stack2;

    // 出对 将stack1移动到stack2中
    while (stack1.length) {
      // stack1出栈
      const result = stack1.pop();
      stack2.push(result);
    }

    // 出栈
    res = stack2.pop();

    // 重制stack2
    while (stack1.length) {
      // stack1出栈
      const result = stack1.pop();
      stack2.push(result);
    }

    return res;
  }

  /**
   * 查看首个元素 不存在则返回null
   * @return {number}
   */
  peek() {
    if (this.stack1.length > 0) {
      return this.stack1[0];
    }
    return null;
  }

  /**
   * 是否为空
   * @return {boolean}
   */
  empty() {
    return this.stack1.length === 0;
  }
}
