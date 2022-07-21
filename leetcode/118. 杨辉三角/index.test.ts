import { generate } from './index'

describe('最大子数组的和', () => {
  test('case 1', () => {
    expect(generate(5)).toEqual([[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]
    )
  })
})