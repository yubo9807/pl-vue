import { binding } from "./reactivity/reactive";

type Source = Function
type Option = {
  immediate?: boolean
  deep?:      boolean
}
type Cb = <T>(newValue: T, oldValue: T) => void

/**
 * 侦听器
 * @param source 
 * @param cb
 * @param option 
 * @returns 
 */
export function watch(source: Source, cb: Cb, option: Option = {}) {
  let oldValue = source();
  option.immediate && cb(oldValue, oldValue);
  let cleanup = false;

  binding(() => {
    const value = source();
    if (oldValue !== value && !cleanup) {
      cb(value, oldValue);
    }
    oldValue = value;
  });

  return () => {
    cleanup = true;
  }
}