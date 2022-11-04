# 手撸vue3 响应式数据源码

## 实现过程
1. reactive 是核心，所有响应式数据都是建立在 reactive 的基础上；
2. readonly 与 reactive 的唯一区别就是在重新赋值时会返回 oldValue；
3. ref 基于 reactive 套了一层对象，通过改变对象中的键值对实现响应式；可以简单理解为

```js
function ref(value) {
  return reactive({ value });
}
```

4. computed 在获取 value 时执行 getter 获取对应的值，设置 value 时执行 setter 函数。

## vue3 中存在的问题

```js
const obj = { __v_isRef: true }
isRef(obj);  //--> true
```
