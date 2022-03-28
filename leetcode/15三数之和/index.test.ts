import { threeSum } from './index';

describe('三数之和', () => {
  it('case 1', () => {
    const input = [-1, 0, 1, 2, -1, -4];
    expect(threeSum(input)).toEqual([
      [-1, -1, 2],
      [0, -1, 1],
    ]);
  });

  it('case 2', () => {
    const input: number[] = [];
    expect(threeSum(input)).toEqual([]);
  });

  it('case 3', () => {
    const input = [0];
    expect(threeSum(input)).toEqual([]);
  });
});
