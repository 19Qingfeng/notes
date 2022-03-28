import { lengthOfLongestSubstring } from './index';

describe('无重复最长子串', () => {
  it('case 1', () => {
    expect(lengthOfLongestSubstring('bbbbb')).toEqual(1);
  });
  it('case 2', () => {
    expect(lengthOfLongestSubstring('abcabcbb')).toEqual(3);
  });
  it('case 3', () => {
    expect(lengthOfLongestSubstring('pwwkew')).toEqual(3);
  });
});
