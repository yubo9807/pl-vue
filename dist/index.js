(() => {
  // src/utils/judge.ts
  function isType(o) {
    return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
  }
  function isObject(o) {
    return ["object", "array"].includes(isType(o));
  }
  function hasOwn(target, key) {
    return Object.prototype.hasOwnProperty.call(target, key);
  }

  // src/reactivity/reactive.ts
  var ReactiveFlags = {
    RAW: Symbol("__v_raw"),
    IS_READONLY: Symbol("__v_isReadonly")
  };
  function reactive(target) {
    return new Proxy(target, {
      get(target2, key, receiver) {
        if (key === ReactiveFlags.RAW)
          return target2;
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
          console.log(`update ${isType(target2)}[${key.toString()}]: ${oldValue} --> ${value}`);
        }
        return result;
      },
      deleteProperty(target2, key) {
        const hasKey = hasOwn(target2, key);
        const result = Reflect.deleteProperty(target2, key);
        if (hasKey && result) {
          console.log(`delete ${isType(target2)}[${key.toString()}]`);
        }
        return result;
      }
    });
  }

  // src/reactivity/ref.ts
  function ref(value) {
    return reactive({ value });
  }

  // src/reactivity/effect.ts
  var ReactiveEffect = class {
    fn;
    constructor(fn) {
      this.fn = fn;
    }
  };

  // src/reactivity/computed.ts
  var map = /* @__PURE__ */ new WeakMap();
  var ComputedRefImpl = class {
    computed;
    _setter;
    constructor(getter, setter) {
      this.computed = new ReactiveEffect(getter);
      this._setter = setter;
      map.set(getter, ref(getter()));
    }
    get value() {
      return this.computed.fn();
    }
    set value(val) {
      const oldValue = this.computed.fn();
      if (!isObject(oldValue)) {
        console.warn(`Write operation failed: computed value is readonly`);
        return;
      }
      map.get(this.computed.fn).value = val;
      this._setter(val);
    }
  };
  function computed(option) {
    if (typeof option === "function") {
      return new ComputedRefImpl(option, function set(val) {
      });
    }
    return new ComputedRefImpl(option.get, option.set);
  }

  // src/index.ts
  var obj = {
    a: 1,
    b: {
      c: 3,
      d: 4
    }
  };
  var a = ref(1);
  var c = computed(() => obj.a);
  console.log(c);
  console.log(computed(() => a));
})();
