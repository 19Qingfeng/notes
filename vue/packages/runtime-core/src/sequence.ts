/**
 *
 * Vue3中对于Dom Diff的优化 -> 最长递增子序列
 * @param {*} arr
 */
export function getSequence(arr) {
  const length = arr.length - 1;

  const result = [0]; // 保存的是索引
  const p = new Array(arr.length).fill(0); // 前节点追溯的列表

  for (let i = 0; i <= length; i++) {
    const maxIndex = result[result.length - 1];
    const lastResultValue = arr[maxIndex];
    // 当前值
    const currentValue = arr[i];

    // 相等没必要添加
    if (currentValue === lastResultValue) {
      continue;
    }

    // 直接添加
    if (lastResultValue < currentValue) {
      result.push(i);
      p[i] = maxIndex; // 记录当前元素对应前节点位置
      continue;
    }

    // 二分查找 寻找当前result中该值应该插入
    let start = 0,
      middle = 0,
      end = result.length - 1;

    while (start < end) {
      // 二分查找 中间部分索引
      middle = ((start + end) / 2) | 0;
      // result 中的中间值
      const middleValue = arr[result[middle]];

      // *这里需要注意的是 二分查找是有序的
      // 也就是说意味着： 当插入某个值时
      // 如果在左侧计算 -> 那么需要包含当前值(middle)，因为无法确认插入值是替换middle还是middle-1
      // 相反如果是右侧 -> 那么一定不会包含middle，只能插入到middle右侧，因为有序从小到大。比middle大，一定不会替换middle
      if (currentValue > middleValue) {
        start = middle + 1;
      } else {
        end = middle;
      }
    }

    result[start] = i;
    p[i] = result[start - 1]; // 同样前节点追溯
  }

  // !上述确定了最长递增子序列的长度
  // !同时根据p列表确定了每个节点对应的前节点，方便追溯

  // !之后通过最后一个最大的序列节点结合p列表进行前节点追溯确认顺序
  let resultLength = result.length;
  let last = result[resultLength - 1]; // 最大的一项
  while (resultLength-- > 0) {
    result[resultLength] = last;
    last = p[last];
  }
  return result;
}

console.log(getSequence([2, 3, 1, 5, 6, 8, 7, 9, 4]));
