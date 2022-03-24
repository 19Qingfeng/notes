/**
 *
 * 输入：num1 = "11", num2 = "123"
 * 输出："134"
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
export const addStrings = function (num1: string, num2: string) {
  let result = '';
  // 首先两数相加 应该将两数补齐 开头补0
  const maxLength = Math.max(num1.length, num2.length);
  num1 = num1.padStart(maxLength, '0');
  num2 = num2.padStart(maxLength, '0');

  let baseSystem = 0;
  for (let i = maxLength - 1; i >= 0; i--) {
    const first = parseInt(num1[i]);
    const second = parseInt(num2[i]);
    const currentResult = first + second + baseSystem;

    baseSystem = Math.floor(currentResult / 10);
    result = (currentResult % 10) + result;
  }

  result = baseSystem === 0 ? result : baseSystem + result;

  return result;
};
