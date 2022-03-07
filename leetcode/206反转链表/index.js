class Node {
  constructor(value, next) {
    this.value = value
    this.next = next
  }
}

class LinkList {
  constructor() {
    this.head = null
    this.size = 0
  }

  // 通过索引搜索
  getNodeByIndex(index) {
    let current = this.head
    while (index-- > 0) {
      current = current.next
    }
    return current
  }

  // 添加
  add(index, element) {
    // 参数重载
    if (arguments.length === 1) {
      element = index
      index = this.size
    }
    if (this.head === null) {
      this.head = new Node(element)
    } else {
      const preNode = this.getNodeByIndex(index - 1)
      // 添加一个节点
      preNode.next = new Node(element, preNode.next)
    }
    this.size++;
    return this
  }

  // 删除
  remove(index) {
    let removeNode
    if (index === 0) {
      removeNode = this.head
      if (removeNode) {
        this.head = this.head.next
        this.size--;
      }
    } else {
      const prevNode = this.getNodeByIndex(index - 1)
      removeNode = prevNode.next
      prevNode.next = prevNode.next.next
    }
    return removeNode
  }

  // 更新当前元素
  update(index, element) {
    const currentNode = this.getNodeByIndex(index)
    if (currentNode) {
      currentNode.element = element
    }
    return currentNode
  }

  // 反转链表
  reverse() {
    // 核心思路还是通过中间变量保存 依次替换
    // 临时变量 遍历方法
    let prev = null
    let current = this.head
    while (current) {
      const next = current.next
      current.next = prev
      prev = current
      current = next
    }
  }
}

const ll = new LinkList()
ll.add(1) // 1
ll.add(2) // 1 2
ll.add(1, 3) // 1 3 2
console.log(ll.reverse())
console.log(ll.head, 'll')
// console.log(ll, 'll')
// ll.remove(1) // 1 2
// console.log(ll, 'll')
// ll.update(1, 100)
// console.log(ll, 'll')



