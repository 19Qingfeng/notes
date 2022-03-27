import { isPlainObj } from '@vue/share';
import { trackEffect, triggerEffects } from './effect';
import { reactive } from './reactive';

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
