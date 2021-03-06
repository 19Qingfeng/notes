import { reactive } from '@vue/reactivity';
import { hasOwn, ShapeFlags } from '@vue/share';

/**
 *
 * @param instance 组件实例
 * @param rawProps 原始组件接受的真实Props
 */
export function initProps(instance, rawProps) {
  const props = {};
  const attrs = {};

  // 组件内部显式接受的props
  const options = instance.propsOptions || {};

  if (rawProps) {
    // 别忘记了 for in 可以遍历到原型上的可扩展属性
    // 而Object.keys 仅仅支持自身属性
    for (let key in rawProps) {
      const value = rawProps[key];
      if (hasOwn(options, key)) {
        // 为Props
        props[key] = value;
      } else {
        // 为 attrs
        attrs[key] = value;
      }
    }
  }

  // props是响应式的 但是注意是浅的 shallowReactive
  // 这里自己实现简单点就使用 reactive
  instance.props = reactive(props);
  instance.attrs = attrs;
}

/**
 * 初始化组件插槽
 * @param instance
 * @param children
 */
export function initSlots(instance, children) {
  if (instance.vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    instance.slots = children;
  }
}

/**
 * 检查是否需要更新
 */
export function hasPropsChanged(prevProps, nextProps) {
  // 首先检查key的个数是否改变
  const prevPropsLength = Object.keys(prevProps);
  const nextPropsLength = Object.keys(nextProps);

  if (prevPropsLength.length !== nextPropsLength.length) {
    return true;
  }

  // 其次检查value值是否改变
  for (let key of prevPropsLength) {
    const value = prevProps[key];
    const nextValue = nextProps[key];
    if (value !== nextValue) {
      return true;
    }
  }
  return false;
}

/**
 * 更新Props
 */
export function updateProps(prevProps, nextProps) {
  console.log(prevProps, '改变ReactiveData props 应该也会触发effect执行对吧');
  for (let key in nextProps) {
    prevProps[key] = nextProps[key];
  }
  // 删除老的属性
  for (let oldKey in prevProps) {
    if (!hasOwn(nextProps, oldKey)) {
      delete prevProps.props[oldKey];
    }
  }
}
