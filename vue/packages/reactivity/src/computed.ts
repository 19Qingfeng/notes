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
  // 依赖于这个computed的Effect
  public _deps = new Set();

  constructor(getter, public setter) {
    // *调用computed()时内部该computed会对应一个effect
    // *当computed getter执行时 会利用该内部的effect收集对应的响应式数据
    this.effect = new ReactiveEffect(getter, () => {
      //*  当前computed对应的effect依赖的响应式数据发生变化时，因为传入了scheduler。所以会执行传入的scheduler
      if (!this._dirty) {
        // 更改当前computed的状态 _dirty为true 表示需要
        this._dirty = true;
        // *同时当computed依赖的值发生了变化，那么此时需要通知依赖于当前computed的effect，进行触发更新（重新执行对应effect）
        // *重新执行effect时，又回触发computed的getter 重新计算computed
        triggerEffects(this._deps);
      }
    });
  }

  get value() {
    // *收集当前computed依赖的effect 比如如果哪个Effect中使用了该computed
    // *那么此时该effect会被记录在computed的_deps中
    // !注意trackEffect同样可以记录effect对应的computed中的依赖 可以增加this._deps._is_computed = '看看'; 调试看看
    trackEffect(this._deps);

    // 是否是脏的 如果是脏的则需要重新计算computed的值
    if (this._dirty) {
      this._dirty = false;
      // *重新计算当前computed中对应的effect函数，也就是调用getter函数获得getter函数的返回值赋值给 this.value
      // *需要注意的是同时当this.effect.run()时，会重新收集依赖。关联当前computed对应的effect和computed内部依赖的响应式数据
      this._value = this.effect.run();
    }

    // 不脏 不用重新计算computed的值 直接返回内部的返回值
    return this._value;
  }

  set value(value) {
    this.setter(value);
  }
}

export { computed };
