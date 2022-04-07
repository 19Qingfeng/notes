import { isArray, isPlainObj } from '@vue/share';
import { createVNode, isVNode } from './vnode';

/**
 * h日常传递参数种类
 * 1. h('div')
 * 2. h('div',{ style:{ color:'red' } })
 * 3. h('div',{ style:{ color:'red' } },'hello')
 * 4. h('div','hello')
 * 5. h('div',null, 'hello','world')
 * 6. h('div',h('span'))
 * 7. h('div',[h('span')])
 * 通过h方法格式化参数，传递到createVNode时children只存在两种可能一种纯文本，一种是一个数组
 */
export function h(type, propsOrChildren, children) {
  const length = arguments.length;
  // 两个参数
  if (length === 2) {
    if (isPlainObj(propsOrChildren) && !isArray(propsOrChildren)) {
      // 第二个参数是属性 || 非数组Vnode
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      // 第二个参数非对象 有可能是字符串
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (length > 3) {
      children = Array.from(arguments).slice(3);
    } else if (length === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
