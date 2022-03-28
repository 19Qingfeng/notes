import { isArray, isPlainObj } from '@vue/share';
import { trackEffect, triggerEffects } from './effect';
import { reactive } from './reactive';

class ObjectRefImpl {
  constructor(public object, public key) {}

  // *本质上还是通过代理来触发原本对象上的getter和setter
  get value() {
    return this.object[this.key];
  }

  set value(value) {
    this.object[this.key] = value;
  }
}

// 本质上还是进行了一层劫持
function toRef(object, key) {
  return new ObjectRefImpl(object, key);
}

export function toRefs(object) {
  const result = isArray(object) ? new Array(object.length) : {};

  for (let key in object) {
    result[key] = toRef(object, key);
  }

  return result;
}

// 相当于将Ref在变成Proxy
export function proxyRefs(object) {
  // 当访问对象的某个key时候 相当于访问 object中对应属性的value
  return new Proxy(object, {
    get(target, key, recevier) {
      const r = Reflect.get(target, key, recevier);
      // * 这里进行判断，如果是ref值，那么当触发getter时，会触发原本对象的.value值
      // 当然非的话直接使用就好了
      return r.__v_isRef__ ? r.value : r;
    },
    set(target, key, value, recevier) {
      const oldValue = target[key];
      if (oldValue.__v_isRef__) {
        // *如果是Ref的话，那么此时劫持修改对应的老值.value
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, recevier);
      }
    },
  });
}

export function ref(value) {
  return new RefImpl(value);
}

function toReactive(value) {
  return isPlainObj(value) ? reactive(value) : value;
}

/**
 * 本质上还是利用依赖收集和触发更新
 * *同样 _value 表示当前ref的值，它有可能是一个代理对象
 * *而 rawValue 则有可能是一个Proxy对象值
 * *内部通过_deps维护了一份当前Ref对应的依赖 类似于computed、watch
 */
class RefImpl {
  public __v_isRef__ = true;
  private _value;
  private _deps = new Set();
  constructor(public rawValue) {
    this._value = toReactive(rawValue);
  }

  get value() {
    // !get时会收集这个ref使用到的相关effect
    trackEffect(this._deps);
    return this._value;
  }

  set value(newValue) {
    // 如果两个值相同的话 则不进行触发更新
    if (this.rawValue !== newValue) {
      // !set时又是触发更新
      this._value = toReactive(newValue);
      this.rawValue = newValue;
      triggerEffects(this._deps);
    }
  }
}
