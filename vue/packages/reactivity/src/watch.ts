import { isPlainObj } from '@vue/share';
import { ReactiveEffect } from './effect';

/**
 * TODO: watch没写完
 * * watch本质上也是基于effect 不过它比computed简单
 * 它仅仅需要收集内部依赖的响应式数据，当内部数据改变触发当前watch的effect执行从而执行对应传入的callback(scheduler)
 * 而computed在内部依赖的响应式数据改变后，会触发当前computed的effect重新执行，从而调用内部依赖于computed的effect执行，从而重新触发computed的getter函数进行重新计算值
 * @param source
 * @param callback
 */
export function watch(source, callback) {
  let getter;
  if (isPlainObj(source)) {
    // ?这里需要进行一次依赖收集 要触发依赖收集就需要在getter中进行数据的访问 那么我就递归进行数据的访问 这里回头参考源码补充实现逻辑
    getter = () => source;
  }

  // 当当前watch内部依赖的响应式数据发生改变时，会触发当前watch的effect
  // 从而执行对应的scheduler函数(job)
  const job = () => {
    // 执行watch传入的callback 同时需要重新对于watch进行依赖收集计算变化后的依赖值
    callback();
  };

  const _effect = new ReactiveEffect(source, job);
}
