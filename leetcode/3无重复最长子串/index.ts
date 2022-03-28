/**
 * 给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。
 * 输入: s = "abcabcbb"
 * 输出: 3
 * 解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。
 * 双指针 滑动窗口 遍历过的存在重复时只需要干掉队头进入下一个元素继续判断即可
 * @param {string} s
 * @return {number}
 */
export const lengthOfLongestSubstring = function (s: string) {
  const stringList: string[] = [];
  let r: number = 0;
  let result = 0;

  for (let i = 0; i < s.length; i++) {
    // 再次进入时表示有重复的了
    if (i !== 0) {
      stringList.shift();
    }

    while (r < s.length && !stringList.includes(s[r])) {
      stringList.push(s[r]);
      r++;
    }

    // 寻找出当前开头不重复的了
    result = Math.max(result, stringList.length);
  }

  return result;
};
