/* 
  给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。


  你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。

  返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。
  */

// 写过很多遍了，其实本质就是 DP 
// 假设当前天卖出（以当前天的钱-之前最小的值）获得利润和之前最大的利润相比即可，O(n)
const maxProfit = function (prices: number[]) {
  let max = 0;
  let min = prices[0]
  prices.forEach(value => {
    min = Math.min(min, value)
    max = Math.max(max, value - min)
  })
  return max
};

export {
  maxProfit
}