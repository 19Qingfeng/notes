const nodes = [
  { id: 3, name: '节点C', parentId: 1 },
  { id: 6, name: '节点F', parentId: 3 },
  { id: 0, name: 'root', parentId: null },
  { id: 1, name: '节点A', parentId: 0 },
  { id: 8, name: '节点H', parentId: 4 },
  { id: 4, name: '节点D', parentId: 1 },
  { id: 2, name: '节点B', parentId: 0 },
  { id: 5, name: '节点E', parentId: 2 },
  { id: 7, name: '节点G', parentId: 2 },
  { id: 9, name: '节点I', parentId: 5 },
];

/**
 * 思路不错本质上还是利用引用类型的特点
 * 时间复杂度 O(n)
 * @param {*} arr
 * @returns
 */
function parseArr(nodes) {
  const map = Object.create(null);
  const result = [];

  nodes.forEach((node) => {
    const id = node.id;
    map[id] = node;
  });

  nodes.forEach((node) => {
    // 获取当前节点的父亲节点
    const parent = map[node.parentId];
    if (parent) {
      (parent.children || (parent.children = [])).push(node);
    } else {
      result.push(node);
    }
  });

  return result;
}

console.log(JSON.stringify(parseArr(nodes)));
