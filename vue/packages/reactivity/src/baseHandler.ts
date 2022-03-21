import { activeEffect } from './effect';

// IS_REACTIVE 表示当前已经被Vue的reactive包装成为了reactive对象
export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
}

// !Vue内部通过全局 WeakMap 来关联Effect和对应的响应式对象

export const mutableHandlers = {
  get(target, key, receiver) {
    // 1.2 调用reactive包裹已经为reactive处理后的proxy对象时处理
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    // 依赖收集时 一个对象的一个key 可能对应关联多个Effect
    track(target, key, receiver);

    // 配合Reflect解决当访问get属性递归依赖this的问题
    return Reflect.get(target, key, receiver);
  },
  // 当进行设置时进行触发更新
  set(target, key, value, receiver) {
    // 配合Reflect解决当访问get属性递归依赖this的问题
    return Reflect.get(target, key, receiver);
  },
};
