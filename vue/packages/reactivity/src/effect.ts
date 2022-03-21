// *当前正在运行的Effect，用于依赖收集关联
// !注意的是ESModule 中export导出的值是动态变化的，这点和Export是不同的
// !ESModule中导出的引用 会随着模块内部值变化而更改导出值
export let activeEffect;

/**
 * Reactive Effect
 */
class ReactiveEffect {
  private fn: Function;
  // 表示effect是否激活状态
  private active: boolean;
  // 用户记录嵌套Effect清空 （Vue3.0版本是栈记录 后来改成类似于节点 更加提高性能）
  private parent?: Function;
  constructor(fn) {
    this.fn = fn;
    this.active = true;
    this.parent = undefined;
  }

  run() {
    // 当前非激活状态下 直接执行Effect中的fn即可
    // 无需对于Effect中进行依赖收集
    if (!this.active) {
      this.fn();
    }

    try {
      // ? 2.1 解决嵌套Effect问题
      // 记录当前挂载在全局的Effect
      this.parent = activeEffect;
      activeEffect = this;
      // 当执行Effect时候优先进行依赖收集
      // 这里的核心思路还有当前 Effect 执行时候，会调用run调用传入的函数
      // 同时将当前effect实例挂在全局变量上
      // *将当前正在执行的Effect关联在全局用于和响应式数据的收集
      // 此时当函数执行时内部如果有依赖的响应式数据
      // 那么会触发响应式数据的 Getter 此时Getter中会进行依赖收集
      // 会关联当前全局的Effect和触发Getter的响应式数据
      return this.fn();
    } finally {
      // 每次Effect run 结束后会还原嵌套的Effect
      activeEffect = this.parent;
    }
  }
}

function effect(fn) {
  // 调用Effect创建一个响应式的Effect 它会返回一个响应式的React
  const _effect = new ReactiveEffect(fn);

  // 调用Effect时Effect内部的函数会默认先执行一次
  _effect.run();
}

export { effect };
