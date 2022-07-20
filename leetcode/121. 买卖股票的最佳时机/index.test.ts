import { maxProfit } from "."

describe('买卖股票的最佳时机', () => {
  test('case 1', () => {
    expect(maxProfit([7, 1, 5, 3, 6, 4])).toEqual(5)
  })
})