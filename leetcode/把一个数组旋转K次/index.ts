/**
 * 将数组旋转K次
 *
 */

// 时间复杂度O(n^2)
function rotate1(arr: number[], key: number): number[] {
  const length = arr.length;
  if (length === 0) {
    return arr;
  }
  const step = Math.abs(key % length);

  // 一次循环耗时O(n)
  for (let i = 0; i < step; i++) {
    const n = arr.pop();
    if (n) {
      // 所谓数组是连续的内存空间
      // 相当于for循环中每次都进行unshift，每次unshift都会针对数组中所有的元素进行重新排序
      // 相当乎O(n)循环中每一步骤在进行一次O(n) 即为O(n^2)
      arr.unshift(n); // 之所以是n^2 数组是有序结构 所以unshift、shift、splice会非常慢
    }
  }

  return arr;
}

// O(1)
function rotate2(arr: number[], key: number): number[] {
  const length = arr.length;
  if (length === 0) {
    return arr;
  }
  const step = Math.abs(key % length);

  const firstArr = arr.slice(-step);
  const secondArr = arr.slice(0, length - step);
  return firstArr.concat(secondArr);
}

export { rotate1, rotate2 };

// time

console.time('rotate1');
const arr1 = [];
for (let i = 0; i < 100 * 1000; i++) {
  arr1.push(i);
}
rotate1(arr1, 90 * 1000);
console.timeEnd('rotate1');

console.time('rotate2');
const arr2 = [];
for (let i = 0; i < 100 * 1000; i++) {
  arr2.push(i);
}
rotate2(arr2, 90 * 1000);
console.timeEnd('rotate2');
