(() => {
  // src/vue3/utils/judge.ts
  function isType(o) {
    return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
  }
  function isObject(o) {
    return typeof o === "object";
  }
  function hasOwn(target, key) {
    return Object.prototype.hasOwnProperty.call(target, key);
  }
  function isEquals(val1, val2) {
    if (typeof val1 === "object" && typeof val2 === "object") {
      const keys1 = Object.keys(val1), keys2 = Object.keys(val2);
      if (keys1.length !== keys2.length)
        return false;
      for (const key of keys1) {
        if (!keys2.includes(key))
          return false;
        return isEquals(val1[key], val2[key]);
      }
      return true;
    } else {
      return val1 === val2;
    }
  }
  function isAssignmentValueToNode(value) {
    return ["string", "number"].includes(typeof value);
  }
  function noRenderValue(value) {
    return [void 0, null, "", true, false].includes(value);
  }

  // src/vue3/reactivity/depend.ts
  var func = null;
  var funcsMap = /* @__PURE__ */ new WeakMap();
  function binding(fn) {
    func = fn;
    fn();
    func = null;
  }
  function dependencyCollection(key) {
    const funcs = funcsMap.get(key) || [];
    func && funcs.push(func);
    funcsMap.set(key, funcs);
  }
  function distributeUpdates(key) {
    const funcs = funcsMap.get(key);
    funcs && funcs.forEach((fn, index) => {
      const del = fn();
      if (typeof del === "boolean" && del) {
        funcs.splice(index, 1);
        funcsMap.set(key, funcs);
      }
    });
  }

  // src/vue3/reactivity/reactive.ts
  var rawMap = /* @__PURE__ */ new WeakMap();
  var ReactiveFlags = {
    RAW: Symbol("__v_raw"),
    IS_READONLY: Symbol("__v_isReadonly")
  };
  function reactive(target) {
    if (!isObject(target) || rawMap.get(target))
      return target;
    return new Proxy(target, {
      get(target2, key, receiver) {
        if (key === ReactiveFlags.RAW)
          return target2;
        dependencyCollection(target2);
        const result = Reflect.get(target2, key, receiver);
        return isObject(result) ? reactive(result) : result;
      },
      set(target2, key, value, receiver) {
        const oldValue = Reflect.get(target2, key, receiver);
        const result = Reflect.set(target2, key, value, receiver);
        if (target2[ReactiveFlags.IS_READONLY]) {
          return oldValue;
        }
        if (result && oldValue !== value) {
          distributeUpdates(target2);
        }
        return result;
      },
      deleteProperty(target2, key) {
        const hasKey = hasOwn(target2, key);
        const result = Reflect.deleteProperty(target2, key);
        if (hasKey && result) {
          distributeUpdates(target2);
        }
        return result;
      }
    });
  }

  // src/vue3/reactivity/ref.ts
  var ISREF = "__v_isRef";
  var RefImpl = class {
    [ISREF] = true;
    __v_isShallow = false;
    _rawValue;
    _value;
    constructor(value) {
      this._rawValue = value;
      this._value = isObject(value) ? reactive(value) : reactive({ value });
    }
    get value() {
      return isObject(this._rawValue) ? this._value : this._value.value;
    }
    set value(newValue) {
      this._rawValue = newValue;
      if (isObject(newValue))
        this._value = newValue;
      else
        this._value.value = newValue;
    }
  };
  function ref(value) {
    return new RefImpl(value);
  }

  // src/vue3/reactivity/effect.ts
  var ReactiveEffect = class {
    fn;
    constructor(fn) {
      this.fn = fn;
    }
  };

  // src/vue3/reactivity/computed.ts
  var ComputedRefImpl = class {
    __v_isReadonly = true;
    [ISREF] = true;
    _cacheable = true;
    _dirty = true;
    computed;
    _setter;
    constructor(getter, setter) {
      this.computed = new ReactiveEffect(getter);
      this._setter = setter;
    }
    get value() {
      return this.computed.fn();
    }
    set value(val) {
      this._setter ? this._setter(val) : console.warn(`Write operation failed: computed value is readonly`);
    }
  };

  // src/vue3/utils/object.ts
  function clone(obj) {
    if (obj instanceof Array)
      return cloneArray(obj);
    else if (obj instanceof Object)
      return cloneObject(obj);
    else
      return obj;
  }
  function cloneObject(obj) {
    let result = {};
    let names = Object.getOwnPropertyNames(obj);
    for (let i = 0; i < names.length; i++) {
      result[names[i]] = clone(obj[names[i]]);
    }
    return result;
  }
  function cloneArray(obj) {
    let result = new Array(obj.length);
    for (let i = 0; i < result.length; i++) {
      result[i] = clone(obj[i]);
    }
    return result;
  }

  // src/vue3/watch.ts
  function watch(source, cb, option = {}) {
    let cleanup = false;
    if (cleanup)
      return;
    const oldValue = source();
    let backup = clone(oldValue);
    option.immediate && cb(oldValue, void 0);
    binding(() => {
      if (cleanup)
        return true;
      const value = source();
      const bool = option.deep ? isEquals(value, backup) : value === oldValue;
      if (!bool) {
        cb(value, reactive(backup));
        backup = clone(value);
      }
    });
    return () => {
      cleanup = true;
    };
  }

  // src/vue3/vdom/h.ts
  function h(tag, attrs, ...children) {
    return {
      tag,
      attrs: attrs || {},
      children
    };
  }

  // src/vue3/vdom/create-element.ts
  function createElement(tag, attrs = {}, children = "") {
    if (noRenderValue(children))
      return;
    if (typeof tag === "string") {
      return createElementReal(tag, attrs, children);
    } else if (typeof tag === "function") {
      if (tag.name === "Fragment") {
        return createElementFragment(children);
      }
      const h2 = tag(attrs);
      return createElement(h2.tag, h2.attrs, h2.children);
    }
  }
  function createElementReal(tag, attrs = {}, children = "") {
    const el = document.createElement(tag);
    if (children instanceof Array) {
      children.forEach((val) => {
        if (val instanceof Array) {
          el.appendChild(createElementFragment(val));
        } else if (isType(val) === "object") {
          const node = createElement(val.tag, val.attrs, val.children);
          el.appendChild(node);
        } else if (isAssignmentValueToNode(val)) {
          const textNode = document.createTextNode(val.toString());
          el.appendChild(textNode);
        } else if (typeof val === "function") {
          const textNode = document.createTextNode("");
          let backupNode = null;
          binding(() => {
            const value = val();
            if (isAssignmentValueToNode(value)) {
              textNode.nodeValue = value.toString();
              if (backupNode !== null) {
                backupNode.parentElement.replaceChild(textNode, backupNode);
              }
              backupNode = textNode;
            } else if (isType(value) === "object") {
              const node = createElement(value.tag, value.attrs, value.children);
              backupNode ? backupNode.parentElement.replaceChild(node, backupNode) : el.appendChild(node);
              backupNode = node;
            }
          });
          el.appendChild(textNode);
        }
      });
    } else if (isAssignmentValueToNode(children)) {
      el.innerText = children.toString();
    } else if (typeof children === "function") {
      binding(() => {
        el.innerText = children().toString();
      });
    }
    for (const prop in attrs) {
      el[prop] = attrs[prop];
    }
    if (attrs.style && attrs.style instanceof Object) {
      for (const prop in attrs.style) {
        const value = attrs.style[prop];
        if (typeof value === "function") {
          binding(() => el.style[prop] = value());
        } else {
          el.style[prop] = value;
        }
      }
    }
    return el;
  }
  function createElementFragment(children) {
    const fragment = document.createDocumentFragment();
    if (children instanceof Array) {
      children.forEach((val) => {
        if (isAssignmentValueToNode(val)) {
          const textNode = document.createTextNode(val.toString());
          fragment.appendChild(textNode);
        } else if (isType(val) === "object") {
          const node = createElement(val.tag, val.attrs, val.children);
          fragment.appendChild(node);
        } else if (typeof val === "function") {
          const textNode = document.createTextNode("");
          binding(() => {
            textNode.nodeValue = val().toString();
          });
          fragment.appendChild(textNode);
        }
      });
    } else if (isAssignmentValueToNode(children)) {
      const textNode = document.createTextNode(children);
      fragment.appendChild(textNode);
    } else if (typeof children === "function") {
      const textNode = document.createTextNode("");
      binding(() => {
        textNode.nodeValue = children().toString();
      });
      fragment.appendChild(textNode);
    }
    return fragment;
  }

  // src/vue3/vdom/render.ts
  function render({ tag, attrs, children }) {
    return createElement(tag, attrs, children);
  }

  // src/index.tsx
  function Comp(props) {
    const unwatch = watch(() => props.count(), (value) => {
      if (value >= 5)
        unwatch();
      console.log(value);
    }, { immediate: true });
    return /* @__PURE__ */ h("span", null, props.count);
  }
  function App() {
    const count = ref(1);
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h(Comp, { count: () => count.value }), /* @__PURE__ */ h("button", { onclick: () => count.value++ }, "click"));
  }
  document.getElementById("root").appendChild(render(/* @__PURE__ */ h(App, null)));
})();
