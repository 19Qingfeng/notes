var VueRuntimeDOM = (() => {
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

  // packages/runtime-dom/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    Fragment: () => Fragment,
    Text: () => Text,
    domOps: () => renderOptions,
    h: () => h,
    ref: () => ref,
    render: () => render
  });

  // packages/reactivity/src/effect.ts
  var activeEffect;
  var ReactiveEffect = class {
    constructor(fn, schedule) {
      this.deps = [];
      this.fn = fn;
      this.active = true;
      this.parent = void 0;
      this.scheduler = schedule;
    }
    run() {
      if (!this.active) {
        return this.fn();
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
  function isObj(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  var isArray = Array.isArray;
  var hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
  var isString = (val) => typeof val === "string";

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

  // packages/reactivity/src/ref.ts
  function proxyRefs(object) {
    return new Proxy(object, {
      get(target, key, recevier) {
        const r = Reflect.get(target, key, recevier);
        return r.__v_isRef__ ? r.value : r;
      },
      set(target, key, value, recevier) {
        const oldValue = target[key];
        if (oldValue.__v_isRef__) {
          oldValue.value = value;
          return true;
        } else {
          return Reflect.set(target, key, value, recevier);
        }
      }
    });
  }
  function ref(value) {
    return new RefImpl(value);
  }
  function toReactive(value) {
    return isPlainObj(value) ? reactive(value) : value;
  }
  var RefImpl = class {
    constructor(rawValue) {
      this.rawValue = rawValue;
      this.__v_isRef__ = true;
      this._deps = /* @__PURE__ */ new Set();
      this._value = toReactive(rawValue);
    }
    get value() {
      trackEffect(this._deps);
      return this._value;
    }
    set value(newValue) {
      if (this.rawValue !== newValue) {
        this._value = toReactive(newValue);
        this.rawValue = newValue;
        triggerEffects(this._deps);
      }
    }
  };

  // packages/runtime-core/src/vnode.ts
  var Text = Symbol("Text");
  var Fragment = Symbol("Fragment");
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  function createVNode(type, props, children = null) {
    let shapeFlag = isString(type) ? 1 /* ELEMENT */ : isPlainObj(type) ? 4 /* STATEFUL_COMPONENT */ : 0;
    const vnode = {
      type,
      props,
      children,
      key: props == null ? void 0 : props.key,
      el: null,
      shapeFlag,
      __v_isVNode: true
    };
    if (children) {
      vnode.shapeFlag |= isString(children) ? 8 /* TEXT_CHILDREN */ : isObj(children) ? 32 /* SLOTS_CHILDREN */ : 16 /* ARRAY_CHILDREN */;
    }
    return vnode;
  }

  // packages/runtime-core/src/h.ts
  function h(type, propsOrChildren, children) {
    const length = arguments.length;
    if (length === 2) {
      if (isPlainObj(propsOrChildren) && !isArray(propsOrChildren)) {
        if (isVNode(propsOrChildren)) {
          return createVNode(type, null, [propsOrChildren]);
        }
        return createVNode(type, propsOrChildren);
      } else {
        return createVNode(type, null, propsOrChildren);
      }
    } else {
      if (length > 3) {
        children = Array.from(arguments).slice(3);
      } else if (length === 3 && isVNode(children)) {
        children = [children];
      }
      return createVNode(type, propsOrChildren, children);
    }
  }

  // packages/runtime-core/src/componentProps.ts
  function initProps(instance, rawProps) {
    const props = {};
    const attrs = {};
    const options = instance.propsOptions || {};
    if (rawProps) {
      for (let key in rawProps) {
        const value = rawProps[key];
        if (hasOwn(options, key)) {
          props[key] = value;
        } else {
          attrs[key] = value;
        }
      }
    }
    instance.props = reactive(props);
    instance.attrs = attrs;
  }
  function initSlots(instance, children) {
    if (instance.vnode.shapeFlag & 32 /* SLOTS_CHILDREN */) {
      instance.slots = children;
    }
  }
  function hasPropsChanged(prevProps, nextProps) {
    const prevPropsLength = Object.keys(prevProps);
    const nextPropsLength = Object.keys(nextProps);
    if (prevPropsLength.length !== nextPropsLength.length) {
      return true;
    }
    for (let key of prevPropsLength) {
      const value = prevProps[key];
      const nextValue = nextProps[key];
      if (value !== nextValue) {
        return true;
      }
    }
    return false;
  }
  function updateProps(prevProps, nextProps) {
    console.log(prevProps, "\u6539\u53D8ReactiveData props \u5E94\u8BE5\u4E5F\u4F1A\u89E6\u53D1effect\u6267\u884C\u5BF9\u5427");
    for (let key in nextProps) {
      prevProps[key] = nextProps[key];
    }
    for (let oldKey in prevProps) {
      if (!hasOwn(nextProps, oldKey)) {
        delete prevProps.props[oldKey];
      }
    }
  }

  // packages/runtime-core/src/component.ts
  function createComponentInstance(vnode) {
    const instance = {
      data: null,
      vnode,
      subTree: null,
      isMounted: false,
      update: null,
      render: null,
      propsOptions: vnode.type.props,
      props: {},
      attrs: {},
      proxy: {},
      slots: {},
      setupState: {}
    };
    return instance;
  }
  var publishPropertyMap = {
    $: (i) => i,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots
  };
  var publishInstanceProxy = {
    get(target, key, receiver) {
      const { props, data, setupState } = target;
      if (hasOwn(data, key)) {
        return data[key];
      } else if (hasOwn(setupState, key)) {
        return setupState[key];
      } else if (hasOwn(props, key)) {
        return props[key];
      } else {
        const getter = publishPropertyMap[key];
        if (getter) {
          return getter(target);
        }
        return Reflect.get(target, key, receiver);
      }
    },
    set(target, key, value) {
      const { props, data, setupState } = target;
      if (hasOwn(data, key)) {
        data[key] = value;
        return true;
      } else if (hasOwn(setupState, key)) {
        setupState[key] = value;
        return true;
      } else if (hasOwn(props, key)) {
        console.warn("Don't Revise Component Props");
      }
      return false;
    }
  };
  function setupComponent(instance) {
    const { props, type, children } = instance.vnode;
    initProps(instance, props);
    initSlots(instance, children);
    instance.proxy = new Proxy(instance, publishInstanceProxy);
    const { data = () => ({}), render: render2, setup } = type;
    if (!isFunction(data)) {
      console.error("Component Data Must Be Function");
    }
    instance.data = reactive(data.call(instance.proxy));
    if (setup) {
      const setupContext = {
        emit: (eventName, ...args) => {
          const event = `on${eventName.slice(0, 1).toUpperCase()}${eventName.slice(1)}`;
          const originalEvent = instance.vnode.props;
          const handler = originalEvent[event];
          if (handler) {
            handler(...args);
          }
        },
        attrs: instance.attrs,
        slots: instance.slots
      };
      const setupResult = setup(instance.props, setupContext);
      if (isFunction(setupResult)) {
        instance.render = setupResult;
      } else if (isPlainObj(setupResult)) {
        instance.setupState = proxyRefs(setupResult);
      }
    }
    if (!instance.render) {
      instance.render = render2;
    }
  }

  // packages/runtime-core/src/scheduler.ts
  var queue = [];
  var nextTick = Promise.resolve();
  var isFlushing = false;
  function queueJob(job) {
    if (!queue.includes(job)) {
      queue.push(job);
    }
    if (!isFlushing) {
      isFlushing = true;
      nextTick.then(() => {
        isFlushing = false;
        const copyQueue = queue.slice(0);
        queue.length = 0;
        for (let i = 0; i < copyQueue.length; i++) {
          const job2 = copyQueue[i];
          job2();
        }
        copyQueue.length = 0;
      });
    }
  }

  // packages/runtime-core/src/sequence.ts
  function getSequence(arr) {
    const length = arr.length - 1;
    const result = [0];
    const p = new Array(arr.length).fill(0);
    for (let i = 0; i <= length; i++) {
      const maxIndex = result[result.length - 1];
      const lastResultValue = arr[maxIndex];
      const currentValue = arr[i];
      if (currentValue === lastResultValue) {
        continue;
      }
      if (lastResultValue < currentValue) {
        result.push(i);
        p[i] = maxIndex;
        continue;
      }
      let start = 0, middle = 0, end = result.length - 1;
      while (start < end) {
        middle = (start + end) / 2 | 0;
        const middleValue = arr[result[middle]];
        if (currentValue > middleValue) {
          start = middle + 1;
        } else {
          end = middle;
        }
      }
      result[start] = i;
      p[i] = result[start - 1];
    }
    let resultLength = result.length;
    let last = result[resultLength - 1];
    while (resultLength-- > 0) {
      result[resultLength] = last;
      last = p[last];
    }
    return result;
  }
  console.log(getSequence([2, 3, 1, 5, 6, 8, 7, 9, 4]));

  // packages/runtime-core/src/renderer.ts
  function createRenderer(renderOptions2) {
    const {
      createElement: hostCreateElement,
      createText: hostCreateText,
      insert: hostInsert,
      remove: hostRemove,
      setElementText: hostSetElementText,
      setText: hostSetText,
      querySelector: hostQuerySelector,
      parentNode: hostParentNode,
      nextSibling: hostNextSibling,
      patchProps: hostPatchProps
    } = renderOptions2;
    function normalize(vnode) {
      if (isString(vnode)) {
        return createVNode(Text, null, vnode);
      }
      return vnode;
    }
    function unmount(vnode) {
      hostRemove(vnode.el);
      vnode.el = null;
    }
    function mountChildren(el, children) {
      children.forEach((vnode, index) => {
        let childVNode = children[index] = normalize(vnode);
        patch(null, childVNode, el);
      });
    }
    function unMountChildren(children) {
      for (let i = 0; i < children.length; i++) {
        unmount(children[i]);
      }
    }
    function patchProps2(oldProps, newProps, container) {
      for (let newKey in newProps) {
        hostPatchProps(container, newKey, oldProps[newKey], newProps[newKey]);
      }
      for (let oldKey in oldProps) {
        if (newProps[oldKey] === null) {
          hostPatchProps(container, oldKey, oldProps[oldKey], void 0);
        }
      }
    }
    function patchKeyedChildren(c1, c2, el) {
      let i = 0;
      let e1 = c1.length - 1;
      let e2 = c2.length - 1;
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i];
        if (isSameVNodeType(n1, n2)) {
          patch(n1, n2, el);
          i++;
        } else {
          break;
        }
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2];
        if (isSameVNodeType(n1, n2)) {
          patch(n1, n2, el);
          e1--;
          e2--;
        } else {
          break;
        }
      }
      if (i > e1) {
        if (i <= e2) {
          while (i <= e2) {
            const anchor = c2[e2 + 1] ? c2[e2 + 1].el : null;
            const newNode = normalize(c2[i]);
            patch(null, newNode, el, anchor);
            i++;
          }
        }
      } else if (i > e2) {
        if (i <= e1) {
          while (i <= e1) {
            console.log(c1, "c2");
            const oldNode = normalize(c1[i]);
            unmount(oldNode);
            i++;
          }
        }
      }
      const s1 = i;
      const s2 = i;
      const toBePatchLength = e2 - s2 + 1;
      const keyedMap = /* @__PURE__ */ new Map();
      const MappingArr = new Array(toBePatchLength).fill(0);
      for (let i2 = s2; i2 <= e2; i2++) {
        keyedMap.set(c2[i2].key, i2);
      }
      for (let i2 = s1; i2 <= e1; i2++) {
        const oldVnode = c1[i2];
        const newIndex = keyedMap.get(oldVnode.key);
        if (!newIndex) {
          unmount(oldVnode);
        } else {
          MappingArr[newIndex - s2] = i2 + 1;
          patch(oldVnode, c2[newIndex], el);
        }
      }
      const increment = getSequence(MappingArr);
      let j = increment.length - 1;
      for (let i2 = toBePatchLength - 1; i2 >= 0; i2--) {
        const index = i2 + s2;
        const current = c2[index];
        const anchor = index + 1 <= c2.length ? c2[index + 1].el : null;
        if (MappingArr[i2] > 0) {
          if (i2 !== increment[j]) {
            hostInsert(current.el, el, anchor);
          } else {
            j--;
          }
        } else {
          patch(null, current, el, anchor);
        }
      }
    }
    function patchChildren(n1, n2) {
      const n1Children = n1.children;
      const n2Children = n2.children;
      const prevShapeFlag = n1.shapeFlag;
      const shapeFlag = n2.shapeFlag;
      if (shapeFlag & 8 /* TEXT_CHILDREN */) {
        if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
          unMountChildren(n1Children);
        }
        if (n1Children !== n2Children) {
          hostSetElementText(n2.el, n2Children);
        }
      } else {
        if (prevShapeFlag & 16 /* ARRAY_CHILDREN */) {
          if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
            patchKeyedChildren(n1Children, n2Children, n2.el);
          } else {
            unMountChildren(n1Children);
          }
        } else {
          if (prevShapeFlag & 8 /* TEXT_CHILDREN */) {
            hostSetElementText(n2.el, "");
          }
          if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
            mountChildren(n2Children, n2.el);
          }
        }
      }
    }
    function mountComponent(vnode, container, anchor) {
      const instance = vnode.component = createComponentInstance(vnode);
      setupComponent(instance);
      setupRenderEffect(instance, container, anchor);
    }
    function shouldUpdateComponent(n1, n2) {
      const prevProps = n1.props;
      const nextProps = n2.props;
      const prevChild = n1.children;
      const nextChild = n2.children;
      if (prevChild !== nextChild) {
        console.log("join");
        return true;
      }
      if (prevProps === nextProps)
        return false;
      if (hasPropsChanged(prevProps, nextProps)) {
        return true;
      }
      return false;
    }
    function updateComponent(n1, n2) {
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2)) {
        instance.next = n2;
        instance.update();
      }
    }
    function updateComponentPreRender(instance) {
      const { next } = instance;
      instance.next = null;
      instance.vnode = next;
      updateProps(instance.props, next.props);
    }
    function setupRenderEffect(instance, container, anchor) {
      const { render: render2, proxy } = instance;
      const componentUpdateFn = () => {
        if (instance.isMounted) {
          if (instance.next) {
            updateComponentPreRender(instance);
          }
          const subTree = render2.call(proxy);
          patch(instance.subTree, subTree, container, anchor);
          instance.subTree = subTree;
        } else {
          const subTree = instance.subTree = render2.call(proxy);
          patch(null, subTree, container, anchor);
          instance.isMounted = true;
        }
      };
      const effect2 = new ReactiveEffect(componentUpdateFn, () => {
        queueJob(instance.update);
      });
      const update = instance.update = effect2.run.bind(effect2);
      update();
    }
    function mountElement(vnode, container, anchor) {
      const { shapeFlag, type, props, children } = vnode;
      vnode.el = hostCreateElement(type);
      if (props) {
        for (let key in props) {
          hostPatchProps(vnode.el, key, null, props[key]);
        }
      }
      if (children) {
        if (shapeFlag & 8 /* TEXT_CHILDREN */) {
          hostSetElementText(vnode.el, children);
        } else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
          mountChildren(vnode.el, children);
        }
      }
      hostInsert(vnode.el, container, anchor);
    }
    function patchElement(n1, n2) {
      n2.el = n1.el;
      const n1Props = n1.props || {};
      const n2Props = n2.props || {};
      patchProps2(n1Props, n2Props, n2.el);
      patchChildren(n1, n2);
    }
    function processText(n1, n2, container, anchor) {
      const { children } = n2;
      if (n1 === null) {
        n2.el = hostCreateText(children);
        hostInsert(n2.el, container, anchor);
      } else {
        n2.el = n1.el;
        if (n2.children !== n1.children) {
          hostSetElementText(n2.el, n2.children);
        }
      }
    }
    function processFragment(n1, n2, container, anchor) {
      if (n1 === null) {
        mountChildren(container, n2.children);
      } else {
        patchChildren(n1, n2);
      }
    }
    function processElement(n1, n2, container, anchor) {
      if (n1 === null) {
        mountElement(n2, container, anchor);
      } else {
        patchElement(n1, n2);
      }
    }
    function processComponent(n1, n2, container, anchor) {
      if (n1 === null) {
        mountComponent(n2, container, anchor);
      } else {
        updateComponent(n1, n2);
      }
    }
    function patch(n1, n2, container, anchor = null) {
      const { type, shapeFlag } = n2;
      if (n1 && !isSameVNodeType(n1, n2)) {
        unmount(n1);
        n1 = null;
      }
      switch (type) {
        case Text:
          processText(n1, n2, container, anchor);
          break;
        case Fragment:
          processFragment(n1, n2, container, anchor);
        default:
          if (shapeFlag & 1 /* ELEMENT */) {
            processElement(n1, n2, container, anchor);
          } else if (shapeFlag & 6 /* COMPONENT */) {
            processComponent(n1, n2, container, anchor);
          }
          break;
      }
    }
    return {
      render: (vnode, container) => {
        if (vnode === null) {
          if (container.__vnode)
            unmount(container.__vnode);
        } else {
          patch(container.__vnode || null, vnode, container);
        }
        container.__vnode = vnode;
      }
    };
  }

  // packages/runtime-dom/src/nodeOps.ts
  var nodeOps = {
    createElement(tagName) {
      return document.createElement(tagName);
    },
    createText(text) {
      return document.createTextNode(text);
    },
    insert(el, parent, anchor = null) {
      parent.insertBefore(el, anchor);
    },
    remove(el) {
      const parent = el.parentNode;
      if (parent) {
        parent.removeChild(el);
      }
    },
    setElementText(el, text) {
      el.textContent = text;
    },
    setText(node, text) {
      node.nodeValue = text;
    },
    querySelector(selector) {
      return document.querySelector(selector);
    },
    parentNode(node) {
      return node.parentNode;
    },
    nextSibling(node) {
      return node.nextSibling;
    }
  };

  // packages/runtime-dom/src/modules/attr.ts
  function patchAttr(el, key, value) {
    if (value) {
      el.setAttribute(key, value);
    } else {
      el.removeAttribute(key);
    }
  }

  // packages/runtime-dom/src/modules/class.ts
  function patchClass(el, nextValue) {
    if (nextValue === null) {
      el.removeAttribute("class");
    } else {
      el.className = nextValue;
    }
  }

  // packages/runtime-dom/src/modules/event.ts
  function createInvoker(fn) {
    const invoker = (e) => invoker.value(e);
    invoker.value = fn;
    return invoker;
  }
  function patchEvent(el, eventName, nextValue) {
    const invokers = el._vei ? el._vei : el._vei = {};
    const exits = invokers[eventName];
    if (exits) {
      exits.value = nextValue;
    } else {
      const name = eventName.slice(2).toLowerCase();
      if (nextValue) {
        const invoker = invokers[eventName] = createInvoker(nextValue);
        el.addEventListener(name, invoker);
      } else if (exits) {
        el.removeEventListener(name, exits);
        invokers[eventName] = void 0;
      }
    }
  }

  // packages/runtime-dom/src/modules/style.ts
  function patchStyle(el, prevValue, nextValue = {}) {
    for (let prop in nextValue) {
      el["style"][prop] = nextValue[prop];
    }
    if (prevValue) {
      for (let key in prevValue) {
        if (!nextValue[key]) {
          el["style"][key] = null;
        }
      }
    }
  }

  // packages/runtime-dom/src/patchProps.ts
  function patchProps(el, key, preValue, nextValue) {
    if (key === "class") {
      patchClass(el, nextValue);
    } else if (key === "style") {
      patchStyle(el, preValue, nextValue);
    } else if (/^on[^a-z]/.test(key)) {
      patchEvent(el, key, nextValue);
    } else {
      patchAttr(el, key, nextValue);
    }
  }

  // packages/runtime-dom/src/index.ts
  var renderOptions = Object.assign(nodeOps, { patchProps });
  var render = createRenderer(renderOptions).render;
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-dom.iife.js.map
