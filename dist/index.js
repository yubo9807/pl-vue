(() => {
  // src/utils/judge.ts
  function isType(o2) {
    return Object.prototype.toString.call(o2).slice(8, -1).toLowerCase();
  }
  function isObject(o2) {
    return ["object", "array"].includes(isType(o2));
  }
  function hasOwn(target, key) {
    return Object.prototype.hasOwnProperty.call(target, key);
  }

  // src/reactivity/reactive.ts
  var func = null;
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
    const funcs = [];
    return new Proxy(target, {
      get(target2, key, receiver) {
        if (key === ReactiveFlags.RAW)
          return target2;
        func && funcs.push(func);
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
          funcs.forEach((fn) => fn());
        }
        return result;
      },
      deleteProperty(target2, key) {
        const hasKey = hasOwn(target2, key);
        const result = Reflect.deleteProperty(target2, key);
        if (hasKey && result) {
          console.log(`%c delete ${isType(target2)}[${key.toString()}]`, "color: red");
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

  // src/index.ts
  var obj = {
    a: 1,
    b: {
      c: 3,
      d: 4
    }
  };
  var o = reactive(obj);
  var a = ref(1);
  var value = document.getElementById("value");
  var btn = document.getElementById("btn");
  binding(() => {
    value.innerText = a.value;
  });
  btn.onclick = () => {
    a.value++;
  };
  var input = document.getElementById("input");
  var c = debounceRef("");
  binding(() => {
    input.value = c.value;
    value.innerText = c.value;
  });
  input.oninput = (e) => {
    c.value = e.target.value;
  };
  function debounceRef(value2, delay = 300) {
    let timer = null;
    return customRef((track, trigger) => {
      return {
        get() {
          track();
          return value2;
        },
        set(val) {
          clearTimeout(timer);
          timer = setTimeout(() => {
            value2 = val;
            trigger();
          }, delay);
        }
      };
    });
  }
})();
