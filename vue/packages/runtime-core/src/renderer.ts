import { isString, ShapeFlags } from '@vue/share';
import { createVNode, isSameVNodeType, Text } from './vnode';

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
    patchProps: hostPatchProps,
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

  /**
   * 卸载逻辑
   */
  function unmount(vnode) {
    // 页面卸载对应HTML节点
    hostRemove(vnode.el);
    // 清空引用
    vnode.el = null;
  }

  function mountChildren(el, children) {
    children.forEach((vnode) => {
      // vnode有可能仅仅只是一个字符串
      let childVNode = normalize(vnode);
      patch(null, childVNode, el);
    });
  }

  function unMountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      // 移除之前所有儿子节点
      unmount(children[i]);
    }
  }

  /**
   * 更新元素属性
   */
  function patchProps(oldProps, newProps, container) {
    // 更新原本节点中newProps中的属性
    for (let newKey in newProps) {
      hostPatchProps(container, newKey, oldProps[newKey], newProps[newKey]);
    }
    // 同时移除已经不存在的属性
    for (let oldKey in oldProps) {
      if (newProps[oldKey] === null) {
        hostPatchProps(container, oldKey, oldProps[oldKey], null);
      }
    }
  }

  /**
   * 比较两个虚拟节点children的差异
   * @param n1 旧的节点 vnode
   * @param n2 新的节点 vnode
   */
  function patchChildren(n1, n2) {
    const el = n2.children;
    const n1Children = n1.children;
    const n2Children = n2.children;

    const prevShapeFlag = n1.shapeFlag;

    const shapeFlag = n2.shapeFlag;

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // case: 1.新的是文本节点 旧的是数组节点 不需要DOMDiff
        // 卸载元素所有子节点 同时为元素设置文本节点
        unMountChildren(n1Children);
      }
      // 剩下就是说明之前也是文本
      if (n1Children !== n2Children) {
        hostSetElementText(n2.el, n2Children);
      }
    } else {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // case: 两次孩子都是数组 DOM Diff
        } else {
          // case: 旧的是数组 新的是空
        }
      }
    }
  }

  /**
   * 挂载元素
   */
  function mountElement(vnode, container) {
    const { shapeFlag, type, props, children } = vnode;
    // 1.根据元素类型创建元素
    vnode.el = hostCreateElement(type);
    // 2.属性
    if (props) {
      for (let key in props) {
        hostPatchProps(vnode.el, key, null, props[key]);
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

  /**
   * !相同元素（相同key）更新逻辑，涉及DOM Diff
   * @param n1
   * @param n2
   * @param container
   */
  function patchElement(n1, n2, container) {
    n2.el = n1.el;

    // 1.对比属性
    const n1Props = n1.props || {};
    const n2Props = n2.props || {};
    patchProps(n1Props, n2Props, n2.el);

    // 2.对比children
    patchChildren(n1, n2);
  }

  /**
   * 处理文本节点
   * @param n1
   * @param n2
   * @param container
   */
  function processText(n1, n2, container) {
    const { children } = n2;
    if (n1 === null) {
      // 创建
      n2.el = hostCreateText(children);
      hostInsert(n2.el, container);
    } else {
      // 更新
      // 1. 复用上一次的Dom节点 TextNode
      n2.el = n1.el;
      if (n2.children !== n1.children) {
        // 文本内容有更新 更新节点中的内容即可
        hostSetElementText(n2.el, n2.children);
      }
    }
  }

  /**
   * 处理元素节点
   * @param n1
   * @param n2
   * @param container
   */
  function processElement(n1, n2, container) {
    if (n1 === null) {
      mountElement(n2, container);
    } else {
      // 更新
      patchElement(n1, n2, container);
    }
  }

  // !核心:DomDiff patch 比对 vnode 方法方法
  function patch(n1, n2, container) {
    const { type, shapeFlag } = n2;
    // 不相同的元素节点 压根不需要DOM Diff
    if (n1 && !isSameVNodeType(n1, n2)) {
      // 删除n2
      unmount(n1);
      // 将n1变为null 接下来相当于重新创建n2进行挂载
      n1 = null;
    }
    switch (type) {
      // 文本
      case Text:
        processText(n1, n2, container);
        break;
      default:
        // 元素
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container);
        }
        break;
    }
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
