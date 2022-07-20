import { intersect, intersect2 } from "."
let input1: number[]
let input2: number[]

beforeEach(() => {
  input1 = [1, 2, 2, 1]
  input2 = [2, 2]
})

describe('test case 350', () => {
  test('case 1', () => {
    expect(intersect(input1, input2)).toEqual([2, 2])
  })

  test('case 2', () => {
    expect(intersect2(input1, input2)).toEqual([2, 2])
  })
})