import { isPlainObj } from '@vue/share';

// 利用全局对象的形式来保存已经处理为proxy的对象
const reactiveMap = new WeakMap();

// IS_REACTIVE 表示当前已经被Vue的reactive包装成为了reactive对象
const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
}

const reactive = (obj) => {
  // 传入非对象
  if (!isPlainObj(obj)) {
    return obj;
  }

  // 1.1 fixed 多个相同Object进行reactive时 返回同一个reactive代理对象
  const reactiveObj = reactiveMap.get(obj);
  if (reactiveObj) {
    return reactiveObj;
  }

  // 1.2 fixed 对于已经reactive包装的对象在此进行包装时 直接返回reactvie对象 并不会在此包装
  if (obj[ReactiveFlags.IS_REACTIVE]) {
    // 如果传入的是Proxy对象，上边的操作一定会进入get
    return obj;
  }
  // 声明响应式数据
  const proxy = new Proxy(obj, {
    // 当进行访问时进行依赖收集
    get(target, key, receiver) {
      // 1.2 调用reactive包裹已经为reactive处理后的proxy对象时处理
      if (key === ReactiveFlags.IS_REACTIVE) {
        return true;
      }
      // 配合Reflect解决当访问get属性递归依赖this的问题
      return Reflect.get(target, key, receiver);
    },
    // 当进行设置时进行触发更新
    set(target, key, value, receiver) {
      // 配合Reflect解决当访问get属性递归依赖this的问题
      return Reflect.get(target, key, receiver);
    },
  });

  // 缓存当前对象以及Proxy对象
  reactiveMap.set(obj, proxy);

  return proxy;
};

export { reactive };
