// 表示当前vnode类型 type

import { isArray, isObj, isPlainObj, isString, ShapeFlags } from '@vue/share';

export const Text = Symbol('Text');

export const Fragment = Symbol('Fragment');

export function isVNode(value: any) {
  return value ? value.__v_isVNode === true : false;
}

/**
 * 判断两个虚拟节点是否相同 满足标签名(type)相同 && key值相同
 * @param n1
 * @param n2
 */
export function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}

/**
 * 底层根据type，prop，child创建VNode h方法的底层调用
 * @param type 类型
 * @param prop 属性
 * @param child 儿子
 */
export function createVNode(type, props, children = null) {
  // 当前节点类型
  let shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isPlainObj(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0;

  const vnode = {
    type,
    props,
    children,
    key: props?.key,
    el: null, // diff算法会匹配根据当前Vnode挂载的元素进行对应属性/值替换，而不会重新生成元素
    shapeFlag,
    __v_isVNode: true,
  };

  // 儿子节点类型

  if (children) {
    // isString(children) 如果是字符串 那么表示是 TEXT_CHILDREN
    // 如果不是字符串
    // 1. 是对象 表示是组件的children 插槽
    // 2. 非对象 那么就是数组 表示是儿子节点
    vnode.shapeFlag |= isString(children)
      ? ShapeFlags.TEXT_CHILDREN
      : isObj(children)
      ? ShapeFlags.SLOTS_CHILDREN
      : ShapeFlags.ARRAY_CHILDREN;
  }

  return vnode;
}
