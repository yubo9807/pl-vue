(() => {
  // src/utils/judge.ts
  function isType(o) {
    return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
  }
  function isObject(o) {
    return typeof o === "object";
  }
  function hasOwn(target, key) {
    return Object.prototype.hasOwnProperty.call(target, key);
  }

  // src/reactivity/depend.ts
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

  // src/reactivity/reactive.ts
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

  // src/reactivity/ref.ts
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

  // src/h.ts
  function h(tag, attrs, ...children) {
    return {
      tag,
      attrs: attrs || {},
      children
    };
  }
  function Fragment({ children }) {
    return children;
  }

  // src/createElement.ts
  function createElement(tag, attrs = {}, children = "") {
    if ([void 0, null, "", true, false].includes(children))
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
        } else if (["string", "number"].includes(typeof val)) {
          const textNode = document.createTextNode(val.toString());
          el.appendChild(textNode);
        } else if (typeof val === "function") {
          const fragment = document.createDocumentFragment();
          let cache = null;
          binding(() => {
            cache && cache.nodeName !== "#document-fragment" && cache.remove();
            const value = val();
            if (["string", "number"].includes(typeof value)) {
              const textNode = document.createTextNode(value.toString());
              fragment.appendChild(textNode);
              cache = textNode;
            } else {
              const node = createElement(value.tag, value.attrs, value.children);
              fragment.appendChild(node);
              cache = node;
            }
            el.appendChild(fragment);
          });
        }
      });
    } else if (["string", "number"].includes(typeof children)) {
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
        if (["string", "number"].includes(typeof val)) {
          const textNode = document.createTextNode(val.toString());
          fragment.appendChild(textNode);
        } else if (isType(val) === "object") {
          const node = createElement(val.tag, val.attrs, val.children);
          fragment.appendChild(node);
        }
      });
    } else if (["string", "number"].includes(typeof children)) {
      const textNode = document.createTextNode(children);
      fragment.appendChild(textNode);
    } else if (typeof children === "function") {
      const textNode = document.createTextNode("");
      binding(() => {
        textNode.nodeValue = children();
      });
      fragment.appendChild(textNode);
    }
    return fragment;
  }

  // src/render.ts
  function render({ tag, attrs, children }) {
    return createElement(tag, attrs, children);
  }

  // src/index.tsx
  function Comp(props) {
    const count = ref(0);
    return /* @__PURE__ */ h(Fragment, null, "hello ", props.text, /* @__PURE__ */ h("span", null, () => count.value), /* @__PURE__ */ h("button", { onclick: () => count.value++ }, "click"));
  }
  function App() {
    const hidden = ref(true);
    return /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("div", null, () => hidden.value ? /* @__PURE__ */ h("span", null, "heihei") : /* @__PURE__ */ h(Comp, { text: "word" })), /* @__PURE__ */ h("div", null, /* @__PURE__ */ h("button", { onclick: () => hidden.value = !hidden.value }, () => hidden.value ? "\u9690\u85CF" : "\u663E\u793A")));
  }
  document.getElementById("root").appendChild(render(/* @__PURE__ */ h(App, null)));
})();
