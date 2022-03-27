/**
 * 输入：nums = [10,9,2,5,3,7,101,18]
 * 输出：4
 * 解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。
 * ! O(n^2)
 * TODO: 有时间看看二分吧 实现是想不到了。。
 * @param {number[]} nums
 * @return {number}
 */
export const lengthOfLIS = function (nums: number[]) {
  let max = 0;
  const dep = new Array(nums.length).fill(1, 0);

  // 动态规划
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[i] > nums[j]) {
        dep[i] = Math.max(dep[j] + 1, dep[i]);
      }
    }
  }

  // 最终拿出最长的
  dep.forEach((value) => {
    max = Math.max(value, max);
  });
  return max;
};
