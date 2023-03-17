(() => {
  // src/utils/judge.ts
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
  var CustomRefImpl = class extends RefImpl {
    _get;
    _set;
    constructor(callback) {
      let isRef2 = false;
      const { get, set } = callback(
        () => isRef2 = true,
        () => this.setValue()
      );
      super(get());
      this.__v_isRef = isRef2;
      this._get = get;
      this._set = set;
    }
    get value() {
      return this.__v_isRef ? super.value : this._get();
    }
    set value(val) {
      this._set(val);
    }
    setValue() {
      super.value = this._get();
    }
  };
  function customRef(callback) {
    return new CustomRefImpl(callback);
  }

  // src/utils/object.ts
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

  // src/watch.ts
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

  // src/h.ts
  function h(tag, props = {}, children = "") {
    const div = document.createElement(tag);
    if (children instanceof Array) {
      children.forEach((val) => div.appendChild(val));
    } else {
      if (typeof children === "function") {
        binding(() => div.innerText = children());
      } else {
        div.innerText = children;
      }
    }
    for (const prop in props) {
      div[prop] = props[prop];
    }
    if (props.style && props.style instanceof Object) {
      for (const prop in props.style) {
        const value = props.style[prop];
        if (typeof value === "function") {
          binding(() => div.style[prop] = value());
        } else {
          div.style[prop] = value;
        }
      }
    }
    return div;
  }
  function hFragment(arr) {
    const fragment = document.createDocumentFragment();
    arr.forEach((val) => {
      fragment.appendChild(val);
    });
    return fragment;
  }

  // src/index.ts
  var count = ref(1);
  var text = debounceRef("");
  var root = hFragment([
    h("div", { style: { transform: () => `translateX(${count.value}px)` } }, () => count.value),
    h("button", { onclick: () => count.value++ }, "click"),
    h("div", {}, [
      h("input", { oninput: (val) => text.value = val.target.value }),
      h("span", {}, () => text.value)
    ])
  ]);
  document.getElementById("root").appendChild(root);
  function debounceRef(value, delay = 300) {
    let timer = null;
    return customRef((track, trigger) => ({
      get() {
        track();
        return value;
      },
      set(val) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          value = val;
          trigger();
        }, delay);
      }
    }));
  }
  var unwatch = watch(() => count.value, (value) => {
    if (value > 5)
      unwatch();
    console.log(value);
  });
})();
