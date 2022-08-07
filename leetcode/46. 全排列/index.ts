
/**
 * 回溯算法思路(重点是输入不重复)：
 * 按照层级进行递归，比如[1,2,3].首先进入[1]，之后[1,2]，在之后[1,2,3] 满足匹配条件。回溯到[1,2]，在回溯到[1]重新进入[1,3]，进入[1,3,2]...诸如此类
 * nums = [1,2,3]
 * 输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 * @param nums 
 */
function permute(nums: number[]): number[][] {

  let result: number[][] = []
  // 表示本次路径
  let path: number[] = []
  // 表示本次进入中已经使用过的
  let used: boolean[] = []

  function dps() {
    // depth 满足的话，加入结果
    if (path.length === nums.length) {
      // 留意引用类型的陷阱
      return result.push([...path])
    }
    // 否则，进入遍历 
    for (let i = 0; i < nums.length; i++) {
      if (!used[i]) {
        path.push(nums[i])
        used[i] = true

        dps()
        // 进行回溯
        used[i] = false;
        path.pop()
      }
    }
  }

  dps()
  return result
};

permute(
  [1, 2, 3])