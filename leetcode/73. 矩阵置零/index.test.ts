import { setZeroes } from './index'

describe('73 矩阵置零', () => {
  test('case 1', () => {
    expect(setZeroes([[1, 1, 1], [1, 0, 1], [1, 1, 1]])).toEqual([[1, 0, 1], [0, 0, 0], [1, 0, 1]])
  })
})