import { isFunction } from '@vue/share';
import {
  activeEffect,
  ReactiveEffect,
  track,
  trackEffect,
  triggerEffects,
} from './effect';

/**
 * TODO：具体思想回头在屡屡
 * *其实这么来说 computed内部就是一个effect
 * ?可以这么说，computed内部就是一个effect，不过它是一个可以额外收集依赖的effect 双向关系
 *
 * @param getterOrOptions
 * @returns
 */

function computed(getterOrOptions) {
  let getter;
  let setter;
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
    setter = () => {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('computed no setter.');
      }
    };
  }
  getter = getterOrOptions.get;
  setter = getterOrOptions.set;

  return new ComputedRefImpl(getter, setter);
}

/**
 * computed 类
 */
class ComputedRefImpl {
  public effect;
  // 是否是脏属性 当为脏时会重新计算计算属性的值
  public _dirty = true;
  // computed中缓存的值
  private _value;
  // 记录computed当前依赖的Effect
  public _deps = new Set();

  constructor(getter, public setter) {
    // *将computed中的getter创建一个新的effect
    // *当computed getter执行时
    this.effect = new ReactiveEffect(getter, {
      scheduler: () => {
        //*  当前computed对应的effect依赖的值发生变化时 传入scheduler会触发调度器
        if (!this._dirty) {
          this._dirty = true;
          // *更新的时候让依赖当前computed依赖的effect全部进行一次run
          triggerEffects(this._deps);
        }
      },
    });
  }

  get value() {
    // 同时当前computed还得收集它和对应当前effect的关系
    // 当前computed的值发生改变时（比如computed依赖的响应式值发生了改变，此时会触发当前computed的effect的scheduler执行）
    // *计算属性也需要收集依赖

    //  当前计算属性对应的是 activeEffect
    trackEffect(this._deps);

    if (this._dirty) {
      // 不脏 不用重新计算computed的值
      this._dirty = false;
      // 说明需要重新执行的脏值
      this._value = this.effect.run();
    }

    return this._value;
  }

  set value(value) {
    this.setter(value);
  }
}

export { computed };
