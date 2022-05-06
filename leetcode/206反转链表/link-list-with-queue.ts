/**
 * @description 用链表实现队列 明显优于数组
 */

interface IListNode {
  value: any;
  next: IListNode | null;
}

// 注意特性：先入先出，所以在尾部入 头部出
export class Queue {
  private head: IListNode | null = null;
  private tail: IListNode | null = null;
  private len: number = 0;
  constructor() {}

  /**
   * 入队 队尾加入
   * @param value
   */
  add(value: any) {
    const newNode: IListNode = {
      value,
      next: null,
    };
    if (this.head === null) {
      this.head = newNode;
    }
    // 已经存在链表了
    const tail = this.tail;
    if (tail) {
      tail.next = newNode;
    }
    this.tail = newNode;
    this.len++;
  }

  /**
   * 出队 对头删除
   */
  deQueue() {
    // 从对头进行删除
    const head = this.head;
    // 没有节点 什么都不做
    if (head === null) {
      return null;
    }
    if (this.len <= 0) return null;

    const nextNode = head.next;

    this.head = nextNode;
    this.len--;
    return head.value;
  }

  // get原型属性 非实例属性
  get length() {
    // 随时记录 不用遍历 节省时间复杂度
    return this.len;
  }
}
