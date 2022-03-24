import { addStrings } from './index';

describe('两数相加', () => {
  it('case 1', () => {
    expect(addStrings('11', '123')).toEqual('134');
  });
  it('case 2', () => {
    expect(addStrings('456', '77')).toEqual('533');
  });
  it('case 3', () => {
    expect(addStrings('0', '0')).toEqual('0');
  });
  it('case 3', () => {
    expect(addStrings('1', '9')).toEqual('10');
  });
});
