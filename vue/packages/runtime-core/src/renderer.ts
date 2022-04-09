import { isString, ShapeFlags } from '@vue/share';
import { createVNode, Text } from './vnode';

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

  /**
   * 格式化儿子节点 子节点Vnode有可能是字符串
   * 比如： h('div',{},['123','456'])
   */
  function normalize(vnode) {
    if (isString(vnode)) {
      return createVNode(Text, null, vnode);
    }
    return vnode;
  }

  function mountChildren(el, children) {
    children.forEach((vnode) => {
      // vnode有可能仅仅只是一个字符串
      let childVNode = normalize(vnode);
      patch(null, childVNode, el);
    });
  }

  // 挂载元素节点
  function processText(n1, n2, container) {
    const { children } = n2;
    if (n1 === null) {
      // 初始化文本
      n2.el = hostCreateText(children);
    }
    hostInsert(n2.el, container);
  }

  // 挂载元素
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
    hostInsert(vnode.el, container);
  }

  // !核心:DomDiff patch 方法
  function patch(n1, n2, container) {
    const { type, shapeFlag } = n2;
    if (n1 === null) {
      switch (type) {
        // 文本
        case Text:
          processText(n1, n2, container);
          break;
        default:
          // 元素
          if (shapeFlag & ShapeFlags.ELEMENT) {
            mountElement(n2, container);
          }
          break;
      }
    }
    // TODO: rest logic
  }

  /**
   * 卸载逻辑
   */
  function unmount(vnode) {
    // 页面卸载对应HTML节点
    hostRemove(vnode);
    // 清空引用
    vnode.el = null;
  }

  return {
    render: (vnode, container) => {
      // 如果当前vNode可能为空 那么可能为卸载
      // 比如为 render(null, document.getElementById('app'))
      if (vnode === null) {
        // 卸载逻辑
        if (container.__vnode) unmount(container.__vnode);
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
