import { matrixReshape } from './index';

describe('matrixReshape', () => {
  it('case 1', () => {
    expect(matrixReshape([[1, 2], [3, 4]], 1, 4)).toEqual([[1, 2, 3, 4]]);
  });
});
