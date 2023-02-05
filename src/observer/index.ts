
export let func = null; 

/**
 * 自执行
 * @param fn 将响应式对象写在 fn 内，该对象重新赋值时会自行触发 fn()
 */
export function autoRun(fn: Function) {
  func = fn;
  fn();
  func = null;
}