/* 
  给定一个非负整数 numRows，生成「杨辉三角」的前 numRows 行。
  在「杨辉三角」中，每个数是它左上方和右上方的数的和。
  see: https://leetcode.cn/problems/pascals-triangle/

  杨辉三角本质上可以理解成为动态规划，它存在三个条件：
  1. 每行的个数为 i + 1 ，比如第一行为 0+1，第二个行为 1+1..
  2. 同时每一行的首尾都是以1来填充
  3. 同时，要计算当前行某个位置的值。它的值是由上一行该位置-1个下标的值+该位置的值获得的
  详情可以参照这个思路：https://leetcode.cn/problems/pascals-triangle/solution/yang-hui-san-jiao-by-leetcode-solution-lew9/
 */

export const generate = function (numRows: number) {
  const result: number[][] = []
  for (let row = 0; row < numRows; row++) {
    // 每一行的首位都是由1进行填充，并且个数为 row + 1
    // 一、二行可以不用循环，直接进入fill即可
    result[row] = new Array(row + 1).fill(1)
    // 直到之后行，除了首尾。其他元素的值取决于上一行的该位置的索引元素 + 索引-1的元素
    for (let j = 1; j < row; j++) {
      // 获得上行的元素
      const prev = result[row - 1]
      // 从第一个开始循环，循环到倒数第二个元素。（因为每行首尾必定都是1填充）
      result[row][j] = prev[j - 1] + prev[j]
    }
  }

  return result
};

generate(5)