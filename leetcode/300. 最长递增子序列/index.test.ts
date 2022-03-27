import { lengthOfLIS } from './index';

describe('最长递增子序列', () => {
  it('case 1', () => {
    const input = [10, 9, 2, 5, 3, 7, 101, 18];
    expect(lengthOfLIS(input)).toEqual(4);
  });
  it('case 2', () => {
    const input = [0, 1, 0, 3, 2, 3];
    expect(lengthOfLIS(input)).toEqual(4);
  });
  it('case 3', () => {
    const input = [7, 7, 7, 7, 7, 7, 7];
    expect(lengthOfLIS(input)).toEqual(1);
  });
});
