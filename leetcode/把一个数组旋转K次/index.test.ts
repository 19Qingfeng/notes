import { rotate1, rotate2 } from './index';

describe('数组旋转', () => {
  it('正常测试', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7];
    expect(rotate1(arr, 3)).toEqual([5, 6, 7, 1, 2, 3, 4]);
  });
  it('数组为空', () => {
    const arr: number[] = [];
    expect(rotate1(arr, 3)).toEqual([]);
  });
  it('负值', () => {
    const arr: number[] = [1, 2, 3, 4, 5, 6, 7];
    expect(rotate1(arr, 3)).toEqual([5, 6, 7, 1, 2, 3, 4]);
  });
});

describe('数组旋转2', () => {
  it('正常测试', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7];
    expect(rotate2(arr, 3)).toEqual([5, 6, 7, 1, 2, 3, 4]);
  });
  it('数组为空', () => {
    const arr: number[] = [];
    expect(rotate2(arr, 3)).toEqual([]);
  });
  it('负值', () => {
    const arr: number[] = [1, 2, 3, 4, 5, 6, 7];
    expect(rotate2(arr, 3)).toEqual([5, 6, 7, 1, 2, 3, 4]);
  });
});
