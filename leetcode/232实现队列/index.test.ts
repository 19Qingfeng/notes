import { MyQueue } from '.';

describe('232', () => {
  it('case 1', () => {
    const myQueue = new MyQueue();
    myQueue.push(1); // queue is: [1]
    myQueue.push(2); // queue is: [1, 2] (leftmost is front of the queue)
    expect(myQueue.peek()).toEqual(1); // return 1
    expect(myQueue.pop()).toEqual(1); // return 1
    expect(myQueue.empty()).toBeFalsy; // return 1
  });
});
