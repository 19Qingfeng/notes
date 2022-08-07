/**
 * 给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。
 * 输入：nums = [-1,0,1,2,-1,-4]
 * 输出：[[-1,-1,2],[-1,0,1]]
//  * !排序+双指针
 * @param {number[]} nums
 * @return {number[][]}
 */
export const threeSum = function (nums: number[]) {
  const result = [];
  // 正常来说应该三次遍历寻找
  // 这里进行排序之后再进行
  nums = nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length; i++) {
    const current = nums[i];

    if (current >= 0) {
      break;
    }

    // *注意不重复
    if (nums[i] === nums[i - 1]) {
      continue;
    }

    let l = i + 1;
    let r = nums.length - 1;

    // 每个将之后的所有循环查找完
    while (l < r) {
      const sum = nums[l] + nums[r] + current;

      if (sum < 0) {
        l++;
      } else if (sum > 0) {
        r--;
      } else {
        // 为0的情况
        if (nums[r] === nums[r + 1]) {
          // 表示这次添加过了 我不需要重复的
          r--;
          // 排除初始值
        } else if (nums[l] === nums[l - 1] && l !== i + 1) {
          // 同样表示已经添加过了 不需要了，但是需要考虑的是
          l++;
        } else {
          result.push([nums[l], current, nums[r]]);
          l++;
          r--;
        }
      }
    }
  }
  return result;
};

console.log(threeSum([-1, 0, 1, 2, -1, -4]));

// [-1,0,1,2,-1,-4]
// -4  -1 -1 0 1 2
//

// [-1,0,1,2,-1,-4]
// -1 -1 0 1 2
// -1 -1 0 1 2
// [[-1,-1,2],[-1,0,1]]



// 寻找三数字相加为0的
const threeSum1 = (nums: number[]) => {
  // 暴力求解的话得三次递归遍历 时间复杂度上O3 太可怕了
  // [-4,-1,-1,0,1,2]
  // l = 0;r=5
  // 


}

// -1 0 for()  for() [1, 1, 1, 2, -2, -4]
console.log(threeSum1([-1, 0, 1, 2, -1, -4]));
