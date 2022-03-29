import { isPlainObj } from '@vue/share';
import { reactive } from './index';
import { activeEffect, track, trigger } from './effect';

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
    // 利用引用类型的Object作为key 同时在trigger对比对象是否存在（因为同为相同源对象的引用）
    track(target, 'get', key);

    // 之所以使用Reflect.get是因为保证this正确的指向 （当原型链中存在属性访问器劫持时）
    // 详见下面Demo
    // !其实我们简单来说
    // !Proxy中的 receiver 代表的是代理对象 或者 继承代理对象的对象
    // !Reflect中的 receiver 代表的是调用target[key] getter 函数时的this指向会指向对应的 receiver
    let result = Reflect.get(target, key, receiver);
    // 依赖为对象 递归进行reactive处理
    if (isPlainObj(result)) {
      return reactive(result);
    }

    // 配合Reflect解决当访问get属性递归依赖this的问题
    return result;
  },
  // 当进行设置时进行触发更新
  set(target, key, value, receiver) {
    // 如果两次变化的值相同 那么不会触发更新
    const oldValue = target[key];
    // 配合Reflect解决当访问get属性递归依赖this的问题
    const result = Reflect.set(target, key, value, receiver);

    if (value !== oldValue) {
      // 触发更新
      trigger(target, 'set', key, value, oldValue);
    }

    return result;
  },
};

/**
 * 
 * 为什么要使用Reflect Api 结合 Proxy 保证this指向
 let user = {
    _name: "张三",
    get name() {
        console.log(this,'this')
          return this._name;
      }
  };

  let userProxy = new Proxy(user, {
    get(target, prop, receiver) {
      // 因为代理的原因 target 变成了  user
      // user[name] -> 自然张三
      // 这个流程分析下就很清晰了
      return target[prop]; // (*) target = user
      return Reflect.get(target, key, receiver); // (*) target = admin

      // 额外需要 Reflect.get(target,key,receiver) 保证正确的this指向
    }
  });

  let admin = {
    __proto__: user,
    _name: '李四',
  };

  // 期待 『李四』，却输出了 『张三』(?!?)
  console.log(admin.name); // => 张三


  case: 同时来看一个更加直观的例子

  const target = {
    name:'wang.haoyu',
    get alias() {
      return this.name
    }
  }

  const obj = {
  name: 'wang.haoyu',
  get alias() {
    // 依赖了当前name
    return this.name;
  },
};

  const proxy = new Proxy(obj, {
    get(target, key, receiver) {
      console.log(key, 'key');
      return target[key];
    },
    set(target, key, value, receiver) {
      target[key] = value;
      return true;
    },
  });

  // 此时 首先会触发 proxy 的 get陷阱
  // 相当于访问 target[proxy]  -> obj[proxy]
  // 此时并不会触发 this.name 的key值访问
  proxy.alias

  const obj = {
    name: 'wang.haoyu',
    get alias() {
      // 依赖了当前name
      return this.name;
    },
  };

  // 
  const proxy = new Proxy(obj, {
    // receiver: !!The reference to use as the `this` value in the getter function,
    // proxy  陷阱中的 receiver 表示 Proxy或者继承Proxy的对象
    get(target, key, receiver) {
      console.log(key, 'key'); // alias name
      // return target[key];
      //  Reflect 中的 receiver 表示访问时候的this指向 下面的话也就是表示 调用target[key].call(receiver)
      return Reflect.get(target, key, receiver);
    },
  });

  // 会进入两次 保证正确的this指向
  // Reflect.get(target, key, receiver); 会在访问时将this指向对应的receiver
  proxy.alias;


**/
