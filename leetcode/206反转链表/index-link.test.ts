import { Queue } from './link-list-with-queue';

describe('链表实现队列', () => {
  it('case 1', () => {
    const queue = new Queue();
    queue.add(100);
    expect(queue.length).toEqual(1);
    expect(queue.deQueue()).toEqual(100);
    expect(queue.length).toEqual(0);
  });
});
