import { isPlainObj } from '@vue/share';
import { ReactiveEffect } from './effect';
import { isReactive } from './reactive';

/**
 * 本质上traversal还是对于对象的访问 达到可以进行依赖收集的效果
 */
function traversal(obj, map = new Set()) {
  if (typeof obj !== 'object' || obj === null) {
    return;
  }

  // 循环引用
  if (map.has(obj)) {
    return obj;
  }

  // 每次处理对象前，先将对象加入map中防止循环引用
  map.add(obj);
  for (let key in obj) {
    traversal(obj[key], map);
  }

  return obj;
}

/**
 * * watch本质上也是基于effect 不过它比computed简单
 * * 它会对于用户传入的第一个参数当作 effect 的 fn ，进行依赖手机。
 * 它仅仅需要收集内部依赖的响应式数据，当内部数据改变触发当前watch的effect执行从而执行对应传入的callback(scheduler)
 * 而computed在内部依赖的响应式数据改变后，会触发当前computed的effect重新执行，从而调用内部依赖于computed的effect执行，从而重新触发computed的getter函数进行重新计算值
 * @param source
 * @param callback
 */
export function watch(source, callback) {
  let getter;

  if (isReactive(source)) {
    getter = () => traversal(source);
  } else {
    getter = source;
  }

  // 保存上一次的值
  let oldValue;

  // 全局应该有一个
  let clean;
  const onCleanup = (fn) => {
    clean = fn;
  };

  // 当当前watch内部依赖的响应式数据发生改变时，会触发当前watch的effect
  // 从而执行对应的scheduler函数(job)
  const job = () => {
    const newValue = _effect.run(); // 获取新的值，同时重新进行依赖收集

    // *每次调用用户回调之前 检测clean是否存在 如果存在那么定义会执行这个函数
    if (clean) {
      clean();
    }

    // 调用用户callback
    callback(newValue, oldValue, onCleanup);

    // 同时更新oldValue
    oldValue = newValue;
  };

  const _effect = new ReactiveEffect(getter, job); // 监控自己构造的函数，对于source中的进行依赖📱

  oldValue = _effect.run();
}
