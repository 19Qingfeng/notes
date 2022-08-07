class MinStack {
  private stack: number[];
  private minStack: number[]
  /**
   * 本质上利用栈：先入后出的思想。
   * 比如栈中推入 1,2,3 时候，在推入 -1 时。-1 一定是优先于 1，2，3 先出的（因为-1后入）
   * 所以此，在推入 -1 时我们可以保证当前栈中的最小值为 -1
   * 故，在每次栈中入队元素中只要维护一个当前最小的值即可
   */
  constructor() {
    this.stack = []
    this.minStack = []
  }

  push(val: number): void {
    const lastMin = this.minStack[this.minStack.length - 1] ?? val
    this.minStack.push(Math.min(lastMin, val))
    this.stack.push(val)
  }

  pop(): void {
    this.minStack.pop()
    this.stack.pop()
  }

  top(): number {
    return this.stack[this.stack.length - 1]
  }

  getMin(): number {
    return this.minStack[this.minStack.length - 1]
  }
}

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(val)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */