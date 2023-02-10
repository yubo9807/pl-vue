(() => {
  // src/utils/judge.ts
  function isObject(o2) {
    return typeof o2 === "object";
  }
  function hasOwn(target, key) {
    return Object.prototype.hasOwnProperty.call(target, key);
  }

  // src/reactivity/reactive.ts
  var func = null;
  var funcsMap = /* @__PURE__ */ new WeakMap();
  function binding(fn) {
    func = fn;
    fn();
    func = null;
  }
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
        const funcs = funcsMap.get(target2) || [];
        func && funcs.push(func);
        funcsMap.set(target2, funcs);
        const result = Reflect.get(target2, key, receiver);
        return isObject(result) ? reactive(result) : result;
      },
      set(target2, key, value2, receiver) {
        const oldValue = Reflect.get(target2, key, receiver);
        const result = Reflect.set(target2, key, value2, receiver);
        if (target2[ReactiveFlags.IS_READONLY]) {
          return oldValue;
        }
        if (result && oldValue !== value2) {
          const funcs = funcsMap.get(target2);
          funcs && funcs.forEach((fn) => fn());
        }
        return result;
      },
      deleteProperty(target2, key) {
        const hasKey = hasOwn(target2, key);
        const result = Reflect.deleteProperty(target2, key);
        if (hasKey && result) {
          const funcs = funcsMap.get(target2);
          funcs && funcs.forEach((fn) => fn());
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
    constructor(value2) {
      this._rawValue = value2;
      this._value = isObject(value2) ? reactive(value2) : reactive({ value: value2 });
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
  function ref(value2) {
    return new RefImpl(value2);
  }

  // src/utils/object.ts
  function clone(obj2) {
    if (obj2 instanceof Array)
      return cloneArray(obj2);
    else if (obj2 instanceof Object)
      return cloneObject(obj2);
    else
      return obj2;
  }
  function cloneObject(obj2) {
    let result = {};
    let names = Object.getOwnPropertyNames(obj2);
    for (let i = 0; i < names.length; i++) {
      result[names[i]] = clone(obj2[names[i]]);
    }
    return result;
  }
  function cloneArray(obj2) {
    let result = new Array(obj2.length);
    for (let i = 0; i < result.length; i++) {
      result[i] = clone(obj2[i]);
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
        return;
      const value2 = source();
      const bool = option.deep ? compare(value2, backup) : value2 === oldValue;
      if (!bool) {
        cb(value2, reactive(backup));
        backup = clone(value2);
      }
    });
    return () => {
      cleanup = true;
    };
  }
  function compare(obj1, obj2) {
    let flag = true;
    if (typeof obj1 === "object" && typeof obj2 === "object") {
      for (const prop in obj1) {
        if (typeof obj1[prop] === "object") {
          flag = compare(obj1[prop], obj2[prop]);
        } else {
          if (obj1[prop] !== obj2[prop]) {
            flag = false;
            break;
          }
          ;
        }
      }
    } else {
      return obj1 === obj2;
    }
    return flag;
  }

  // src/index.ts
  var obj = {
    a: 1,
    b: {
      c: 3,
      d: {
        e: 5
      }
    }
  };
  var o = reactive(obj);
  var value = document.getElementById("value");
  var btn = document.getElementById("btn");
  var a = ref(1);
  var unwatch = watch(() => o.a, (value2, oldValue) => {
    console.log(value2, oldValue);
  }, { immediate: false, deep: true });
  btn.onclick = () => {
    o.a++;
    o.a >= 5 && unwatch();
  };
})();
