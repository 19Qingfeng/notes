import { isPlainObj } from '@vue/share';
import { ReactiveFlags } from './baseHandler';
import { mutableHandlers } from './baseHandler';

// 利用全局对象的形式来保存已经处理为proxy的对象
const reactiveMap = new WeakMap();

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
  const proxy = new Proxy(obj, mutableHandlers);

  // 缓存当前对象以及Proxy对象 避免重复对于多个相同对象进行reactive
  reactiveMap.set(obj, proxy);

  return proxy;
};

export { reactive };
