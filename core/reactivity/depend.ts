import { customFind, customForEach, CustomWeakMap, isNormalObject, isObject, Key, nextTick } from "../utils";
import { toRaw } from "./reactive";

type BindingCallBack = (keys?: Set<Key>) => void | true;

let func = null;
const funcsMap: WeakMap<object, { s: Set<Key>, fn: BindingCallBack }[]> = new CustomWeakMap();  // 收集依赖的 map 集合

/**
 * 绑定响应式对象
 * @param fn 将响应式对象写在 fn 内，该对象重新赋值时会自行触发 fn()
 * 当返回 true 时，该函数将在依赖收集中删除，避免占用过多的内存
 */
export function binding(fn: BindingCallBack) {
  func = fn;
  fn();  // 自执行触发 get 方法，方法被保存
  func = null;
}

export let currentKeys: Set<Key> = null;

/**
 * 依赖收集
 * @param source 存入 funcsMap 的键
 * @param key
 */
export function dependencyCollection(source: object, key: Key) {
  if (!func) return;
  const funcs = funcsMap.get(source) || [];
  const query = customFind(funcs, item => func === item.fn);  // 是否有重复存在的函数
  if (query) {
    query.s.add(key);
    currentKeys = query.s;
  } else {
    const s = new Set([key]);
    funcs.push({ s, fn: func });
    funcsMap.set(source, funcs);
    currentKeys = s;
  }
  nextTick(() => currentKeys = null);  // 回收内存
}

/**
 * 派发更新
 * @param source 存入 funcsMap 的键
 * @keys
 */
export function distributeUpdates(source: object, keys: Set<Key>) {
  const funcs = funcsMap.get(source);
  if (!funcs) return;

  customForEach(funcs, (item, index) => {
    const isRemove = item.fn(keys);
    // 清理下内存，将不用的函数删除
    isRemove === true && delete funcs[index];
  });
  funcsMap.set(source, funcs.filter(item => item));
}

/**
 * 回收依赖，清空当前已收集的依赖
 * @params sources ref 或 reactive 对象
 */
export function recycleDepend(...sources: object[]) {
  function _recycleDepend(key: object) {
    const obj = toRaw(key);
    for (const prop in obj) {
      const val = obj[prop];
      isObject(val) && _recycleDepend(val as object);
    }
    funcsMap.delete(obj);
  }
  customForEach(sources, _recycleDepend);
}

/**
 * 深度执行 收集依赖
 * @param target 
 */
export function deepDependencyCollection(target: object) {
  for (const k in target) {
    dependencyCollection(target, k);
    const value = target[k];
    if (isNormalObject(value)) {
      deepDependencyCollection(value);
    }
  }
}

/**
 * 强制触发数据更新
 * @param target 
 */
export function triggerObject(target: object) {
  const keys = new Set(Object.keys(target));
  distributeUpdates(target, keys);
}

/**
 * 深度执行 派发更新
 * @param target 
 */
export function deepTriggerObject(target: object) {
  triggerObject(target);
  for (const k in target) {
    const value = target[k];
    if (isNormalObject(value)) {
      deepTriggerObject(value);
    }
  }
}
