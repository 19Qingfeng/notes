// *当前正在运行的Effect，用于依赖收集关联
// !注意的是ESModule 中export导出的值是动态变化的，这点和Export是不同的
// !ESModule中导出的引用 会随着模块内部值变化而更改导出值
let activeEffect;

function effect(fn, options?: { scheduler: Function }) {
  // 调用Effect创建一个响应式的Effect 它会返回一个响应式的React
  const _effect = new ReactiveEffect(fn, options?.scheduler);

  // 调用Effect时Effect内部的函数会默认先执行一次
  _effect.run();

  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;

  return runner;
}

/**
 * Reactive Effect
 */
export class ReactiveEffect {
  private fn: Function;
  // 表示effect是否激活状态
  private active: boolean;
  // 用户记录嵌套Effect清空 （Vue3.0版本是栈记录 后来改成类似于节点 更加提高性能）
  private parent?: Function;
  // 用于记录当前Effect中依赖的所有属性对应的Set effect 用于每次更新时清空对应属性存储的这个effect
  public deps = [];
  // 任务调度器
  public scheduler?;
  constructor(fn, schedule?) {
    this.fn = fn;
    this.active = true;
    this.parent = undefined;
    this.scheduler = schedule;
  }

  run() {
    // 当前非激活状态下 直接执行Effect中的fn即可
    // 无需对于Effect中的响应式数据进行依赖收集
    if (!this.active) {
      return this.fn();
    }

    try {
      // ? 2.1 解决嵌套Effect问题
      // 记录当前挂载在全局的Effect
      this.parent = activeEffect;
      activeEffect = this;

      // *每次执行前清理当前Effect对应的依赖收集
      clearEffect(this);
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

  stop() {
    // 修改激活状态
    this.active = false;
    // 清空当前Effect中所有关联的数据
    // * 当调用stop时，清空有关该Effect的所有响应式属性关联
    // * 换句话说即使数据改变，targetMap 中也关联到当前effect了
    clearEffect(this);
  }
}

// *用于存储响应式数据和Effect的关系Hash表
const targetMap = new WeakMap();

/**
 * 依赖收集函数 当触发响应式数据的Getter时会进入track函数
 * @param target 访问的原对象
 * @param type 表示本次track从哪里来
 * @param key 访问响应式对象的key
 */
function track(target, type, key) {
  // 当前没有激活的全局Effect 响应式数据没有关联的effect 不用收集依赖
  if (!activeEffect) {
    return;
  }

  // 查找是否存在对象
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()));
  }

  // 查找是否存在对应key对应的 Set effect
  let deps = depsMap.get(key);
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }

  trackEffect(deps);

  /**
   * 比如这样一段代码
   * effect(() => {
   *  a.flag ? a.name : a.age
   * })
   *
   * 当flag为true时，这个effect收集依赖于a.name,a.flag
   * 但当修改flag为false时，当前effect并不依赖于a.name 仅仅依赖于a.flag并且同时会添加对应flag.age
   *
   * 所以当a.flag依赖改变时，触发重新执行effect的函数时，需要清空本次effect收集的依赖 从而进行重新收集依赖
   *
   */
}

export function trackEffect(deps) {
  // 其实Set本身可以去重 这里判断下会性能优化点
  const shouldTrack = !deps.has(activeEffect) && activeEffect;

  if (shouldTrack) {
    // *收集依赖，将 effect 进入对应WeakMap中对应的target中对应的keys
    deps.add(activeEffect);
    // *当然还需要一个反向记录 应该让当前effect也记录它被哪些属性收集后
    // *这样做的意思是为了清理相关的Effect和依赖
    // *在当前Effect中记录
    // *注意；在当前依赖的Effect中deps属性会加入当前依赖属性对应的deps 其实总而言之就是以后会解绑有关当前effect中和所有有关系的响应式属性
    activeEffect.deps.push(deps);
  }
}

/**
 * 触发更新函数
 * @param target 触发更新的源对象
 * @param type 类型
 * @param key 触发更新的源对象key
 * @param value 触发更新的源对象key改变的value
 * @param oldValue 触发更新的源对象原始的value
 */
function trigger(target, type, key, value, oldValue) {
  // 简单来说 每次触发的时 我拿出对应的Effect去执行 就会触发页面更新
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let effects = depsMap.get(key);
  if (!effects) {
    return;
  }

  // effects = new Set(effects);
  // effects.forEach((effect) => {
  //   // *解决3.2 Effect中继续触发setter递归一直调用effect，此时仅仅会执行一次effect
  //   if (activeEffect !== effect) {
  //     // 默认数据变化重新调用effect.run()重新执行清空当前Effect依赖重新执行Effect中fn进行重新收集依赖以及视图更新
  //     effect.run();
  //   }
  // });
  triggerEffects(effects);
}

export function triggerEffects(effects) {
  // !注意Set的关联引用问题 如果利用同一个引入deps进行循环
  // !首先dep.run()时会进行清空依赖相当于在当前deps中干掉effect
  // !之后清空相关依赖之后，又回在此调用effect.fn()相当于在此进行依赖收集 再次在deps中添加对应的effect 会造成死循环
  // !本质上还是Set 删除在添加会卡死而数组forEach不会 数组ForEach时会做一个简单的拷贝 而set不会
  effects = new Set(effects);
  effects.forEach((effect) => {
    // *解决3.2 Effect中继续触发setter递归一直调用effect，此时仅仅会执行一次effect
    if (activeEffect !== effect) {
      if (effect.scheduler) {
        // 如果effect中传入了scheduler数据变化时会触发scheduler而不会直接重新执行effect.run
        effect.scheduler();
      } else {
        // 否则默认数据变化重新调用effect.run()重新执行清空当前Effect依赖重新执行Effect中fn进行重新收集依赖以及视图更新
        effect.run();
      }
    }
  });
}

/**
 * 清理Effect相关的依赖收集内容
 * 每次重新执行Effect时应先清理当前Effect对应的依赖收集，同时重新收集依赖收集
 * @param effect
 */
function clearEffect(effect) {
  const { deps } = effect;
  // !注意进入这里外层由于trigger函数会自身forEach deps
  deps.forEach((dep) => {
    // 清空每一个dep中有关当前effect的
    dep.delete(effect);
  });
  // 同时清空当前Effect的deps属性依赖 等待下次依赖收集关联
  deps.length = 0;
}

export { effect, track, trigger, activeEffect };
