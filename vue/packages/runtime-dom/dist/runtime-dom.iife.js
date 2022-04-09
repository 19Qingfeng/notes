var VueRuntimeDom = (() => {
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
    Text: () => Text,
    domOps: () => renderOptions,
    h: () => h,
    render: () => render
  });

  // packages/share/src/index.ts
  function isPlainObj(value) {
    return typeof value === "object" && value !== null;
  }
  var isArray = Array.isArray;
  var isString = (val) => typeof val === "string";

  // packages/runtime-core/src/vnode.ts
  var Text = Symbol("Text");
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function createVNode(type, props, children = null) {
    let shapeFlag = isString(type) ? 1 /* ELEMENT */ : 0;
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
      vnode.shapeFlag |= isString(children) ? 8 /* TEXT_CHILDREN */ : 16 /* ARRAY_CHILDREN */;
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
      patchProps: patchProps2
    } = renderOptions2;
    function normalize(vnode) {
      if (isString(vnode)) {
        return createVNode(Text, null, vnode);
      }
      return vnode;
    }
    function mountChildren(el, children) {
      children.forEach((vnode) => {
        let childVNode = normalize(vnode);
        patch(null, childVNode, el);
      });
    }
    function processText(n1, n2, container) {
      const { children } = n2;
      if (n1 === null) {
        n2.el = hostCreateText(children);
      }
      hostInsert(n2.el, container);
    }
    function mountElement(vnode, container) {
      const { shapeFlag, type, props, children } = vnode;
      vnode.el = hostCreateElement(type);
      if (props) {
        for (let key in props) {
          patchProps2(vnode.el, key, null, props[key]);
        }
      }
      if (children) {
        if (shapeFlag & 8 /* TEXT_CHILDREN */) {
          hostSetElementText(vnode.el, children);
        } else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
          mountChildren(vnode.el, children);
        }
      }
      hostInsert(vnode.el, container);
    }
    function patch(n1, n2, container) {
      const { type, shapeFlag } = n2;
      if (n1 === null) {
        switch (type) {
          case Text:
            processText(n1, n2, container);
            break;
          default:
            if (shapeFlag & 1 /* ELEMENT */) {
              mountElement(n2, container);
            }
            break;
        }
      }
    }
    function unmount(vnode) {
      hostRemove(vnode);
      vnode.el = null;
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
    const invokers = el._vei ? el._vei : el._vel = {};
    const exits = invokers[eventName];
    if (exits) {
      exits.value = nextValue;
    } else {
      const name = eventName.slice(2).toLowerCase();
      if (nextValue) {
        const invoker = invokers[eventName] = createInvoker(nextValue);
        el.addEventListener(name, invoker);
      } else {
        el.removeEventListener(name, exits);
        invokers[eventName] = void 0;
      }
    }
  }

  // packages/runtime-dom/src/modules/style.ts
  function patchStyle(el, prevValue, nextValue) {
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
