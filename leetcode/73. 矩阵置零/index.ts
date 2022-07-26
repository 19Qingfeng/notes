/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 * 
 * 
 * 三种算法都补充下 
 * 1. 最low的
 * 2. 原地算法
 * 3. 原地算法优化
 * 
 */
export const setZeroes = function (matrix: number[][]) {
  // 第一种方式 不使用原地算法尝试下
  const m = matrix.length // 行
  const n = matrix[0].length // 列
  const rows = new Array(m).fill(false)
  const cols = new Array(n).fill(false)
  // 思路为首先遍历矩阵一次  记录为0的行和列
  for (let row = 0; row < m; row++) {
    for (let col = 0; col < n; col++) {
      const value = matrix[row][col]
      if (value === 0) {
        // 该元素对应行全部为0 同时该元素对应列也应该全部为0
        rows[row] = true;
        cols[col] = true
      }
    }
  }
  // 之后再次进行遍历 如果当前行中存在0
  for (let row = 0; row < m; row++) {
    for (let col = 0; col < n; col++) {
      if (rows[row] || cols[col]) {
        matrix[row][col] = 0
      }
    }
  }
  return matrix
};