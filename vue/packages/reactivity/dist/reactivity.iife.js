var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    computed: () => computed,
    effect: () => effect,
    reactive: () => reactive
  });

  // packages/reactivity/src/effect.ts
  var activeEffect;
  function effect(fn, options) {
    const _effect = new ReactiveEffect(fn, options);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
  }
  var ReactiveEffect = class {
    constructor(fn, options) {
      this.deps = [];
      this.fn = fn;
      this.active = true;
      this.parent = void 0;
      this.scheduler = options == null ? void 0 : options.scheduler;
    }
    run() {
      if (!this.active) {
        this.fn();
      }
      try {
        this.parent = activeEffect;
        activeEffect = this;
        clearEffect(this);
        return this.fn();
      } finally {
        activeEffect = this.parent;
      }
    }
    stop() {
      this.active = false;
      clearEffect(this);
    }
  };
  var targetMap = /* @__PURE__ */ new WeakMap();
  function track(target, type, key) {
    if (!activeEffect) {
      return;
    }
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, deps = /* @__PURE__ */ new Set());
    }
    trackEffect(deps);
  }
  function trackEffect(deps) {
    const shouldTrack = !deps.has(activeEffect) && activeEffect;
    if (shouldTrack) {
      deps.add(activeEffect);
      activeEffect.deps.push(deps);
    }
  }
  function trigger(target, type, key, value, oldValue) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }
    let effects = depsMap.get(key);
    if (!effects) {
      return;
    }
    triggerEffects(effects);
  }
  function triggerEffects(effects) {
    effects = new Set(effects);
    effects.forEach((effect2) => {
      if (activeEffect !== effect2) {
        if (effect2.scheduler) {
          effect2.scheduler();
        } else {
          effect2.run();
        }
      }
    });
  }
  function clearEffect(effect2) {
    const { deps } = effect2;
    deps.forEach((dep) => {
      dep.delete(effect2);
    });
    deps.length = 0;
  }

  // packages/share/src/index.ts
  function isPlainObj(value) {
    return typeof value === "object" && value !== null;
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  var isArray = Array.isArray;

  // packages/reactivity/src/baseHandler.ts
  var mutableHandlers = {
    get(target, key, receiver) {
      if (key === "__v_isReactive" /* IS_REACTIVE */) {
        return true;
      }
      track(target, "get", key);
      let result = Reflect.get(target, key, receiver);
      if (isPlainObj(result)) {
        return reactive(result);
      }
      return result;
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      const result = Reflect.set(target, key, value, receiver);
      if (value !== oldValue) {
        trigger(target, "set", key, value, oldValue);
      }
      return result;
    }
  };

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  var reactive = (obj) => {
    if (!isPlainObj(obj)) {
      return obj;
    }
    const reactiveObj = reactiveMap.get(obj);
    if (reactiveObj) {
      return reactiveObj;
    }
    if (obj["__v_isReactive" /* IS_REACTIVE */]) {
      return obj;
    }
    const proxy = new Proxy(obj, mutableHandlers);
    reactiveMap.set(obj, proxy);
    return proxy;
  };

  // packages/reactivity/src/computed.ts
  function computed(getterOrOptions) {
    let getter;
    let setter;
    if (isFunction(getterOrOptions)) {
      getter = getterOrOptions;
      setter = () => {
        if (true) {
          console.warn("computed no setter.");
        }
      };
    }
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
    return new ComputedRefImpl(getter, setter);
  }
  var ComputedRefImpl = class {
    constructor(getter, setter) {
      this.setter = setter;
      this._dirty = true;
      this._deps = /* @__PURE__ */ new Set();
      this.effect = new ReactiveEffect(getter, {
        scheduler: () => {
          if (!this._dirty) {
            this._dirty = true;
            triggerEffects(this._deps);
          }
        }
      });
    }
    get value() {
      trackEffect(this._deps);
      if (this._dirty) {
        this._dirty = false;
        this._value = this.effect.run();
      }
      return this._value;
    }
    set value(value) {
      this.setter(value);
    }
  };
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.iife.js.map
