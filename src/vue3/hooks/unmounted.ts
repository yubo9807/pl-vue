import { triggerSubCompHook, hookLock } from "./utils";

const map = new WeakMap();

/**
 * 注册 onUnmounted 钩子
 * @param comp 组件名
 * @param fn 
 * @returns 
 */
export function onUnmounted(comp: Function, fn: Function) {
  if (hookLock) return;
  const arr = map.get(comp) || [];
  const isExist = arr.some(func => func === fn);
  if (isExist) return;
  
  arr.push(fn);
  map.set(comp, arr);
}

/**
 * 执行对应的 onUnmounted 钩子
 * @param comp 组件名
 */
export function triggerUnmounted(comp: Function) {
  const funcs = map.get(comp) || [];
  if (funcs.length === 0) return;

  funcs.forEach(func => func());
  map.delete(comp);

  triggerSubCompHook(comp, triggerUnmounted);
}
