import { binding, isReactive } from "./reactivity/reactive";
import { isRef } from "./reactivity/ref";
import { AnyObj } from "./utils/type";

type Source = Function | AnyObj
type Option = {
  immediate?: boolean
  deep?:      boolean
}
type Cb = <T>(newValue: T, oldValue: T) => void

/**
 * 侦听器
 * @param source  响应式数据
 * @param cb      回调函数
 * @param option  配置参数 (.deep 暂不支持)
 * @returns 
 */
export function watch(source: Source, cb: Cb, option: Option = {}): Function {
  let oldValue = null;
  if (typeof source === 'function') {
    oldValue = source();
  } else {
    if (!isRef(source) && !isReactive(source)) return () => {};
    oldValue = isRef(source) ? source.value : source;
  }

  option.immediate && cb(oldValue, oldValue);
  let cleanup = false;

  binding(() => {
    let value = null;
    if (typeof source === 'function') value = source();
    else value = isRef(source) ? source.value : value;

    if (oldValue !== value && !cleanup) {
      cb(value, oldValue);
    }
    oldValue = value;
  });

  return () => {
    cleanup = true;
  }
}