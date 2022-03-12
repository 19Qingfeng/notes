// 给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。

// 请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function (nums, k) {
  // 冒泡排序
  for (let i = nums.length - 1; i >= 0; i--) {
    for (let j = 0; j < i; j++) {
      if (nums[j] > nums[j + 1]) {
        const tem = nums[j];
        nums[j] = nums[j + 1];
        nums[j + 1] = tem;
      }
    }
    // 冒泡查找K次就可以了
    if (nums.length - i === k) {
      return nums[i];
    }
  }
};

console.log(findKthLargest([2, 1], 2));
