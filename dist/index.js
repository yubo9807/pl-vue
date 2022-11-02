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

  // src/reactivity/readonly.ts
  function readonly(target) {
    Reflect.defineProperty(target, ReactiveFlags.IS_READONLY, {
      value: true
    });
    return new Proxy(target, {
      get(target2, key) {
        return Reflect.get(target2, key);
      },
      set(target2, key, value) {
        const oldValue = Reflect.get(target2, key);
        console.warn(`Set operation on key '${key.toString()}' failed: target is readonly.`, { [key.toString()]: oldValue });
        return oldValue;
      },
      deleteProperty(target2, key) {
        const oldValue = Reflect.get(target2, key);
        console.warn(`Delete operation on key '${key.toString()}' failed: target is readonly.`, { [key.toString()]: oldValue });
        return oldValue;
      }
    });
  }

  // src/index.ts
  var obj = reactive({
    a: 1,
    b: {
      c: 3,
      d: 4
    }
  });
  var o = readonly({ a: 1 });
  var b = reactive(o);
  b.a = 123;
  console.log(b);
})();
