const Koa = require('koa');

const app = new Koa();

app.listen(3001, () => {
  console.log('server on 3001 start!');
});

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function (root) {
  if (!root) {
    return [];
  }
  const result = [];
  const stack = [root];
  while (stack.length) {
    const levelNodes = [];
    // 上一层的个数
    const len = stack.len;
    for (let i = 0; i < len; i++) {
      const node = stack.pop();
      node.left && stack.push(node.left);
      node.right && stack.push(node.right);
      levelNodes.push(node.val);
    }
    result.push(levelNodes);
  }
  return result;
};
