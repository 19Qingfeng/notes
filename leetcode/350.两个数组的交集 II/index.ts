

/**
 * 给你两个整数数组 nums1 和 nums2 ，请你以数组形式返回两数组的交集。返回结果中每个元素出现的次数，应与元素在两个数组中都出现的次数一致（如果出现次数不一致，则考虑取较小值）。可以不考虑输出结果的顺序。
  示例 1：

  输入：nums1 = [1, 2, 2, 1], nums2 = [2, 2]
  输出：[2, 2]
  示例 2:

  输入：nums1 = [4, 9, 5], nums2 = [9, 4, 9, 8, 4]
  输出：[4, 9]
 */

// 两种方法 一种是未排序，将短的遍历后利用 Map 存储 key 为值，value为出现的次数。之后在遍历长的，检查是否出现在map中并且次数>0，满足条件value-1，
// 时间复杂度 O(2n)
export const intersect = function (nums1: number[], nums2: number[]) {
  const result: number[] = []
  const countMap: { [key: number]: number } = {}

  for (let item of nums1) {
    if (item in countMap) {
      countMap[item]++; // ++ 操作符.. let a = 0; a++; // a 为 1  a++ 相当于 a = a + 1
    } else {
      countMap[item] = 1
    }
  }

  for (let item of nums2) {
    if (item in countMap && countMap[item] > 0) {
      countMap[item]--;
      result.push(item)
    }
  }
  return result
}

// 第二种方式 进行排序后，双指针O(n)即可，依次进行指针指向
export const intersect2 = function (nums1: number[], nums2: number[]) {
  const result: number[] = []
  nums1 = nums1.sort((a, b) => a - b)
  nums2 = nums2.sort((a, b) => a - b)

  let l = 0;
  let r = 0;
  // 遍历完任意一个长度即可
  while (l < nums1.length && r < nums2.length) {
    const left = nums1[l]
    const right = nums2[r]
    if (left < right) {
      l++;
    } else if (left > right) {
      r++
    } else {
      l++;
      r++;
      result.push(left)
    }
  }
  return result
}
