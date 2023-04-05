
const map = new WeakMap();

/**
 * 注册 onBeforeUnmount 钩子
 * @param comp 
 * @param fn 
 * @returns 
 */
export function onBeforeUnmount(comp, fn: Function) {
  const arr = map.get(comp) || [];
  const isExist = arr.some(func => func === fn);
  if (isExist) return;
  
  arr.push(fn);
  map.set(comp, arr);
}

/**
 * 执行对应的 onBeforeUnmount 钩子
 * @param comp 
 */
export function triggerBeforeUnmount(comp) {
  const funcs = map.get(comp) || [];
  funcs.forEach(func => func());
  map.delete(comp);
}
