import { createLinkListByArr, revertLinkList } from './index';

describe('反转链表', () => {
  it('case 1', () => {
    const arr = [100, 200, 300];
    const linkList = createLinkListByArr(arr);
    const headNode = revertLinkList(linkList);
    expect(headNode).toEqual({
      value: 300,
      next: {
        value: 200,
        next: {
          value: 100,
        },
      },
    });
  });
});
