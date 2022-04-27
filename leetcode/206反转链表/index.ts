/**
 * @description: 1. 链表，物理结构（非逻辑结构) 2. 数组需要一段连续的内存空间，而链表是零散的。 3. 都是有序结构
 * 数组链表有序、Map有序、Set无序、Object无序
 * 数据结构上来说：数组查询快，新增删除慢。而链表查询慢，新增删除快（O1）。
 */

export interface ILinkListNode {
  value: number;
  next?: ILinkListNode;
}

/**
 * 通过数组创建链表
 * @param arr
 */
export function createLinkListByArr(arr: number[]) {
  if (arr.length === 0) {
    throw new Error(`must has LinkList`);
  }
  let curNode: ILinkListNode = {
    value: arr[arr.length - 1],
  };
  for (let i = arr.length - 2; i >= 0; i--) {
    curNode = {
      value: arr[i],
      next: curNode,
    };
  }
  return curNode;
}

/**
 * 反转链表
 * @param head 头节点
 */
export function revertLinkList(head: ILinkListNode) {
  // 中间交换变量
  let prev: undefined | ILinkListNode = undefined;
  while (head) {
    // 原本下一个节点
    const next = head.next as ILinkListNode;
    // 修改当前直接指针
    head.next = prev;
    // 有点绕的时候自己画个图就OK了
    prev = head;
    head = next;
  }
  return prev;
}
