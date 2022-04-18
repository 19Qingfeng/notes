/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
export const search = function (nums: number[], target: number) {
  if (nums.length === 1) {
    return nums[0] === target ? 0 : -1;
  }

  let start = 0,
    middle,
    end = nums.length - 1;

  while (start <= end) {
    if (start === end) {
      return nums[start] === target ? start : -1;
    }
    middle = ((start + end) / 2) | 0; // 取中间位置索引
    const middleValue = nums[middle];
    if (target === middleValue) {
      return middle;
    } else if (target > middleValue) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
};
