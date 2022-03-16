/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function (nums) {
  const result = [];
  nums = nums.sort((a, b) => a - b);

  for (let i = 0; i < nums.length; i++) {
    const first = nums[i];
    if (first > 0) {
      break;
    }

    // repeat
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }

    let left = i + 1;
    let right = nums.length - 1;
    // 结束条件 两者都到中间了
    while (left < right) {
      // 继续进行时候要做判断
      const currentValue = first + nums[left] + nums[right];
      if (currentValue < 0) {
        left++;
      } else if (currentValue > 0) {
        right--;
      } else {
        // 满足条件时
        if (nums[left] === nums[left - 1] && left - 1 !== i) {
          left++;
        } else if (nums[right] === nums[right + 1]) {
          right++;
        } else {
          result.push([first, nums[left], nums[right]]);
          left++;
          right--;
        }
      }
    }
  }
  return result;
};
