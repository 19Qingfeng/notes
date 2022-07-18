/**
 * 给你一个整数数组 nums ，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

  子数组 是数组中的一个连续部分。
  示例 1：

  输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
  输出：6
  解释：连续子数组 [4,-1,2,1] 的和最大，为 6 。
  示例 2：

  输入：nums = [1]
  输出：1
  示例 3：

  输入：nums = [5,4,-1,7,8]
  输出：23
 */

/**
* @param {number[]} nums
* @return {number}
*/
export const maxSubArray = function (nums: number[]) {
  let max = 0;
  let temp = 0
  for (let i = 0; i < nums.length; i++) {
    const value = nums[i]
    if (i === 0) {
      temp = max = value
      continue;
    }
    // TODO: 这里大于自身 而非0
    temp = temp + value < value ? value : temp + value
    max = Math.max(max, temp)
  }
  return max
};
