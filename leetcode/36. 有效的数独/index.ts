/**
 * @param {character[][]} board
 * @return {boolean}
 */
export const isValidSudoku = function (board: string[][]) {
  // 思路还是看了题解的，O1算法 遍历一次 根据规则进行处理
  // 利用数组代替Hash表进行处理 分别填充
  // 9行（个数组） 每个数组长度为9，数组中每个元素对应的下标分别代表1-9的元素，遍历每行时寻找每个数组匹配的元素将它的value+1，表示该元素是否出现过。
  const rowLists = new Array(9).fill(0).map(() => new Array(9).fill(0));
  // 9列（个数组） 每个数组长度为9，数组中每个元素代表的是对应的1-9的元素，遍历每个元素时寻找列中匹配的数组进行+1
  const colLists = new Array(9).fill(0).map(() => new Array(9).fill(0));
  // 方框，共有9个方框 每个方框中同样填充的是1-9对应的元素，我记录它出现的次数
  const rectLists = new Array(9).fill(0).map(() => new Array(9).fill(0));

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      // 元素 将它转成数组
      const el = board[row][col];
      if (el !== '.') {
        const index = el.codePointAt(1)! - '0'.codePointAt(1)! - 1;
        rowLists[row][index]++; // 该行元素出现的次数 +1
        colLists[col][index]++; // 该列元素 出现的次数 +1
        // 处理 box 当前元素所在的位置 row行col列，表示所在的 Box 即为 Math.floor(row/3)*3 + Math.floor(col/3) 
        rectLists[Math.floor(row / 3) * 3 + Math.floor(col / 3)][index]++;
        if (
          rowLists[row][index] > 1 ||
          colLists[col][index] > 1 ||
          rectLists[Math.floor(row / 3) * 3 + Math.floor(col / 3)][index] > 1
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

