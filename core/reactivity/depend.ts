import { AnyObj, customForEach, CustomWeakMap, isNormalObject, isObject } from "../utils";
import { toRaw } from "./reactive";

let func = null;
const funcsMap: WeakMap<object, Function[]> = new CustomWeakMap();  // 收集依赖的 map 集合

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
  const bool = funcs.some(fn => func === fn);  // 是否有重复存在的函数
  if (func && !bool) {
    funcs.push(func);
    funcsMap.set(key, funcs);
  }
}

/**
 * 派发更新
 * @param key 存入 funcsMap 的键
 */
export function distributeUpdates(key: object) {
  const funcs = funcsMap.get(key);
  if (!funcs) return;

  customForEach(funcs, (fn, index) => {
    const isRemove = fn();
    // 清理下内存，将不用的函数删除
    isRemove === true && delete funcs[index];
  });
  funcsMap.set(key, funcs.filter(fn => fn));
}

/**
 * 回收依赖，清空当前已收集的依赖
 * @param key ref 或 reactive 对象
 */
export function recycleDepend(...keys: object[]) {
  function _recycleDepend(key: object) {
    const obj = toRaw(key);
    for (const prop in obj) {
      const val = obj[prop];
      isObject(val) && _recycleDepend(val as object);
    }
    funcsMap.delete(obj);
  }
  customForEach(keys, _recycleDepend);
}

/**
 * 深度执行 收集依赖或派发更新
 * @param target 
 * @param func 
 */
export function deepExecute(target: object, func: typeof dependencyCollection | typeof distributeUpdates) {
  func(target);
  for (const key in target) {
    const value = target[key];
    if (isNormalObject(value)) {
      deepExecute(value, func);
    }
  }
}
