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
    if (!isObject(target))
      return target;
    if (rawMap.get(target))
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

  // src/reactivity/effect.ts
  var ReactiveEffect = class {
    fn;
    constructor(fn) {
      this.fn = fn;
    }
  };

  // src/reactivity/computed.ts
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
  function computed(option) {
    if (typeof option === "function") {
      return new ComputedRefImpl(option);
    }
    return new ComputedRefImpl(option.get, option.set);
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
  var d = computed(() => a.value);
  binding(() => value.innerText = d.value);
  btn.onclick = () => {
    a.value++;
  };
})();
