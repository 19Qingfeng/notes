/**
 * 本质上还是栈的基础思想
 * 遇到左括号 入栈
 * 遇到有括号 对比栈定的是否匹配出栈 不满足的话 那么直接返回false 因为已经不匹配了
 * 最终对比数组长度检查匹配是否存在剩余
 * @param {string} s
 * @return {boolean}
 */

type LeftSymbols = '(' | '[' | '{';
type RightSymbols = ']' | ')' | '}';

function match(left: LeftSymbols, right: RightSymbols) {
  if (left === '(' && right === ')') return true;
  if (left === '[' && right === ']') return true;
  if (left === '{' && right === '}') return true;
  return false;
}

export const isValid = function (s: string) {
  const stack: LeftSymbols[] = [];

  const leftSymbols = '([{';
  const rightSymbols = ')}]';

  for (let i of s) {
    if (leftSymbols.indexOf(i) !== -1) {
      stack.push(i as LeftSymbols);
    } else if (rightSymbols.indexOf(i) !== -1) {
      const stackTop = stack[stack.length - 1];
      if (match(stackTop, i as RightSymbols)) {
        stack.pop();
      } else {
        // 不匹配 直接不满足
        return false;
      }
    }
  }
  return stack.length === 0;
};
