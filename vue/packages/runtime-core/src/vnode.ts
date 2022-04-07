// 表示当前vnode类型 type

import { isArray, isString, ShapeFlags } from '@vue/share';

export function isVNode(value: any) {
  return value ? value.__v_isVNode === true : false;
}

/**
 * 底层根据type，prop，child创建VNode h方法的底层调用
 * @param type 类型
 * @param prop 属性
 * @param child 儿子
 */
export function createVNode(type, props, children = null) {
  // 当前节点类型
  let shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;

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
    vnode.shapeFlag |= isString(children)
      ? ShapeFlags.TEXT_CHILDREN
      : ShapeFlags.ARRAY_CHILDREN;
  }

  return vnode;
}
