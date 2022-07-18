import { maxSubArray } from './index'

describe('最大子数组的和', () => {
  test('case 1', () => {
    const input = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
    expect(maxSubArray(input)).toEqual(6)
  })
})