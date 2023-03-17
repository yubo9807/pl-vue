# 手撸vue3 响应式数据源码

## reactive

reactive 是核心，所有响应式数据都是建立在 reactive 的基础上。

```ts
function reacttive(target) {
  return new Proxy(target, {

    // 获取
    get(target, key, receiver) {
      if (key === ReactiveFlags.RAW) return target;  // 返回原始值

      const result = Reflect.get(target, key, receiver);
      return isObject(result) ? reactive(result) : result;
    },

    // 赋值/修改
    set(target, key, value, receiver) {
      const oldValue = Reflect.get(target, key, receiver);
      const result   = Reflect.set(target, key, value, receiver);

      if (result && oldValue !== value) {
        console.log(value, oldValue);  // 数据发生变化
        // code...
      }
      return result;
    },

    // 删除
    deleteProperty(target, key) {},
  })
}
```

## readonly

readonly 与 reactive 的唯一区别就是在重新赋值时会返回 oldValue。

## ref

ref 基于 reactive 套了一层对象，通过改变对象中的键值对实现响应式；可以简单理解为：

```js
function ref(value) {
  return reactive({ value });
}
```

### vue3 源码中存在的问题

```js
const obj = { __v_isRef: true }
isRef(obj);  //--> true
```

## computed

computed 在获取 value 时执行 getter 获取对应的值，设置 value 时执行 setter 函数。

## customRef

基于 ref，重写 set value 方法进行阻断，在合适的时间进行赋值。

## 数据挂载

### 如何去触发数据更新？

考虑简单一些，如果我某个地方绑定了一个响应式数据，那在我重新赋值时重新更新它是不是就可以了；
如果有一个函数帮我绑定了数据，set value 时直接调用对应的函数。美！

### 实现

```ts
window.func = null;

function binding(fn: Function) {
  window.func = fn;
  fn();  // 数据挂载触发 get 方法
  window.func = null;
}

function reactive(target) {
  const funcs = [];
  return Proxy(target, {
    get() {
      funcs.push(window.func);  // 依赖收集
    },
    set() {
      funcs.forEach(fn => fn());  // 派发更新
    }
  })
}

const a = ref(0);
binding(() => div.innerText = a.value);
```

## watch

watch 是基于数据挂载实现的。既然已经有一个可以自动触发响应式数据的函数，每次改变数据他都会执行，我甚至可以直接写在 watch 中。

```ts
// source 只实现了函数传参
function watch(source: Function, cb: Function, option = {}) {
	let cleanup = false;
  if (cleanup) return;

  const oldValue = source();
	option.immediate && cb(oldValue, viod 0);


  // 数据被调用，自执行
  binding(() => {
    if (!cleanup) return;  // 被取消监听

    const value = source();
    if (value !== oldValue) {
      cb(value, oldValue);
    }
  })

  // 返回一个取消监听函数
  return () => {
    cleanup = true;
  }
}
```

## watchEffect

watchEffect 与 watch 实现方式类似。不支持深度监听，无论绑定的是否为响应式对象都会立即执行。

```ts
function watchEffect(cb: Callback) {
  let cleanup = false;
  let lock = false;

  binding(() => {
    if (cleanup) return;
    cb((cleanupFn) => {
      lock && cleanupFn();  // 第一次不执行
      lock = true;
    });
  })

  return () => {
    cleanup = true;
  }
}
```
