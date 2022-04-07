export function createRenderer(renderOptions) {
  function patch(n1, n2, container) {}

  return {
    render: (vnode, container) => {
      // 如果当前vNode可能为空 那么可能为卸载
      // 比如为 render(null, document.getElementById('app'))
      if (vnode === null) {
        // 卸载逻辑
      } else {
        // 当首次挂载时传入null container下不存在__vnode属性
        // 当更新时，元素内部存在__vnode属性，
        patch(container.__vnode || null, vnode, container);
      }
      // 缓存生成的vnode
      container.__vnode = vnode;
    },
  };
}
