// 给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。

/**
 * @param {string} s 滑动窗口思路 一起来想一想 两个指针来处理这些问题
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  let result = 0;
  // 右侧指针 每次循环重复开始点
  let rightPoint = 0;
  // 保存本批次不重复的子串
  let childString = [];
  for (let i = 0; i < s.length; i++) {
    // 干掉队头吧 每次其实可以使用
    if (i !== 0) {
      childString.shift();
    }
    while (!childString.includes(s[rightPoint]) && rightPoint < s.length) {
      childString.push(s[rightPoint]);
      rightPoint++;
    }
    result = Math.max(childString.length, result); // 此时要不重复 要不读取完成
  }
  return result;
};

// abcabcbb
console.log(lengthOfLongestSubstring('abcabcbb'), '?');
