import { search } from '.';

describe('704', () => {
  it('case 1', () => {
    const nums = [-1, 0, 3, 5, 9, 12];
    const target = 9;
    expect(search(nums, target)).toEqual(4);
  });
  it('case 2', () => {
    const nums = [2, 5];
    const target = 5;
    expect(search(nums, target)).toEqual(1);
  });
});
