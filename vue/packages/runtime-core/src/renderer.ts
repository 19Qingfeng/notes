import { ShapeFlags } from '@vue/share';

export function createRenderer(renderOptions) {
  const {
    createElement: hostCreateElement,
    createText: hostCreateText,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
    setText: hostSetText,
    querySelector: hostQuerySelector,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    patchProps,
  } = renderOptions;

  function mountChildren(el, children) {
    children.forEach((vnode) => {
      patch(null, vnode, el);
    });
  }

  // 首次根据vnode挂载元素
  function mountElement(vnode, container) {
    const { shapeFlag, type, props, children } = vnode;
    // 1.根据元素类型创建元素
    vnode.el = hostCreateElement(type);
    // 2.属性
    if (props) {
      for (let key in props) {
        patchProps(vnode.el, key, null, props[key]);
      }
    }
    // 3.儿子
    if (children) {
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // 文本
        hostSetElementText(vnode.el, children);
      } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 数组
        mountChildren(vnode.el, children);
      }
    }
    // 4.插入页面
    hostInsert(container, vnode.el);
  }

  // !核心:DomDiff patch 方法
  function patch(n1, n2, container) {
    if (n1 === null) {
      mountElement(n2, container);
    }
    // TODO: rest logic
  }

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
