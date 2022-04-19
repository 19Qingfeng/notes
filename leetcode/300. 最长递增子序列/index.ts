/**
 * 输入：nums = [10,9,2,5,3,7,101,18]
 * 输出：4
 * 解释：最长递增子序列是 [2,3,7,101]，因此长度为 4 。
 * ! O(n^2) 动态规划精髓啊！
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

// 二分查找方法
// const lengthOfLIS = function (nums) {
//   const result = [nums[0]]; // 初始为一个
//   for (let i = 0; i < nums.length; i++) {
//     const currentValue = nums[i];
//     const lastMaxValue = result[result.length - 1];
//     if (currentValue === lastMaxValue) {
//       continue;
//     }
//     if (currentValue > lastMaxValue) {
//       result.push(nums[i]); // 记录INDEX
//       continue;
//     }
//     // 当发现更小的 我认为他更有潜力（在原有长度基础上进行替换）
//     // 已经保存的一定是有序的 所以使用二分查找替换对应元素
//     let start = 0,
//       end = result.length - 1,
//       middle = 0;
//     while (start < end) {
//       middle = ((start + end) / 2) | 0;
//       const middleValue = result[middle];
//       if (currentValue > middleValue) {
//         start = middle + 1;
//       } else {
//         end = middle;
//       }
//     }
//     // 找到middle中间值下标
//     result[start] = nums[i];
//   }
//   console.log(result);
//   return result.length;
// };

// lengthOfLIS([1, 2, 3]);
