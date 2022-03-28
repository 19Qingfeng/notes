/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 * 给你两个按 非递减顺序 排列的整数数组 nums1 和 nums2，另有两个整数 m 和 n ，分别表示 nums1 和 nums2 中的元素数目。
 * 请你 合并 nums2 到 nums1 中，使合并后的数组同样按 非递减顺序 排列。
 * 注意：最终，合并后数组不应由函数返回，而是存储在数组 nums1 中。为了应对这种情况，nums1 的初始长度为 m + n，其中前 m 个元素表示应合并的元素，后 n 个元素为 0 ，应忽略。nums2 的长度为 n 。
 * * 双指针指向 时间/空间都为 O(m+n) 时间无论如何都要所有遍历一次
 */
export const merge = function (
  nums1: number[],
  m: number,
  nums2: number[],
  n: number
) {
  let result: number[] = [];

  let l = 0; // copyNum1 索引
  let r = 0; // num2 索引

  while (l < m || r < n) {
    // num1 耗尽
    if (l === m) {
      result = result.concat(nums2.slice(r));
      break;
    }
    // num2 耗尽
    if (r === n) {
      result = result.concat(nums1.slice(l));
      break;
    }

    const currentNums1 = nums1[l];
    const currentNums2 = nums2[r];

    if (currentNums1 >= currentNums2) {
      result.push(currentNums2);
      r++;
    } else {
      result.push(currentNums1);
      l++;
    }
  }

  for (let i = 0; i < n + m; i++) {
    nums1[i] = result[i];
  }
};
