/* 在 MATLAB 中，有一个非常有用的函数 reshape ，它可以将一个 m x n 矩阵重塑为另一个大小不同（r x c）的新矩阵，但保留其原始数据。

给你一个由二维数组 mat 表示的 m x n 矩阵，以及两个正整数 r 和 c ，分别表示想要的重构的矩阵的行数和列数。

重构后的矩阵需要将原始矩阵的所有元素以相同的 行遍历顺序 填充。

如果具有给定参数的 reshape 操作是可行且合理的，则输出新的重塑矩阵；否则，输出原始矩阵。 */

// 其实有挺多种方法的，本质上都是针对于矩阵中的元素进行依次遍历
// TODO: 利用 取整(total/列数) = 行数，以及 (total%行数) = 列数 即可方便的处理

export const matrixReshape = (mat: (number[])[], r: number, c: number) => {
  const rawRow = mat.length
  const rawCol = mat[0].length


  if (rawRow * rawCol != r * c) {
    return mat
  }
  const result = new Array(r).fill(undefined).map(() => new Array(c))

  for (let i = 0; i < r * c; i++) {
    result[Math.floor(i / c)][i % c] = mat[Math.floor(i / rawCol)][i % rawCol]
  }

  return result
}

console.log(
  matrixReshape([[1, 2], [3, 4]], 1, 4)
)