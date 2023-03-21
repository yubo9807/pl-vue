
let func = null;
const funcsMap: WeakMap<object, Function[]> = new WeakMap();  // 搜集依赖的 map 集合

/**
 * 绑定响应式对象
 * @param fn 将响应式对象写在 fn 内，该对象重新赋值时会自行触发 fn()
 * 当返回 true 时，该函数将在依赖收集中删除，避免占用过多的内存
 */
export function binding(fn: Function) {
  func = fn;
  fn();  // 自执行触发 get 方法，方法被保存
  func = null;
}

/**
 * 依赖收集
 * @param key 存入 funcsMap 的键
 */
export function dependencyCollection(key: object) {
  const funcs = funcsMap.get(key) || [];
  func && funcs.push(func);
  funcsMap.set(key, funcs);
}

/**
 * 派发更新
 * @param key 存入 funcsMap 的键
 */
export function distributeUpdates(key: object) {
  const funcs = funcsMap.get(key);
  funcs && funcs.forEach((fn, index) => {
    const del = fn();
    // 清理下内存，将不用的函数删除
    if (typeof del === 'boolean' && del) {
      funcs.splice(index, 1);
      funcsMap.set(key, funcs);
    }
  });
}
