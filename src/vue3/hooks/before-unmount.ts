import { triggerSubCompHook, hookLock } from "./utils";

const map = new WeakMap();

/**
 * 注册 onBeforeUnmount 钩子
 * @param comp 组件名
 * @param fn 
 * @returns 
 */
export function onBeforeUnmount(comp: Function, fn: Function) {
  if (hookLock) return;
  const arr = map.get(comp) || [];
  const isExist = arr.some(func => func === fn);
  if (isExist) return;
  
  arr.push(fn);
  map.set(comp, arr);
}

/**
 * 执行对应的 onBeforeUnmount 钩子
 * @param comp 组件名
 */
export function triggerBeforeUnmount(comp: Function) {
  const funcs = map.get(comp) || [];
  funcs.forEach(func => func());
  map.delete(comp);

  triggerSubCompHook(comp, triggerBeforeUnmount);
}
