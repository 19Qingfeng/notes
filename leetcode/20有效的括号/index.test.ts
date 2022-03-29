import { isValid } from './index';

describe('有效的括号', () => {
  it('case 1', () => {
    expect(isValid('()')).toBeTruthy();
  });

  it('case 2', () => {
    expect(isValid('()[]{}')).toBeTruthy();
  });

  it('case 3', () => {
    expect(isValid('([)]')).toBeFalsy();
  });

  it('case 4', () => {
    expect(isValid('{[]}')).toBeTruthy();
  });
});
