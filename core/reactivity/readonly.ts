import { AnyObj, printWarn } from "../utils";
import { ReactiveFlags } from './reactive';

/**
 * 将对象转为只读
 * @param target 
 * @returns 
 */
export function readonly(target: AnyObj) {

  Reflect.defineProperty(target, ReactiveFlags.IS_READONLY, {
    value: true,
  })

  return new Proxy(target, {

    get(target, key) {
      if (key === ReactiveFlags.RAW) return target;  // 返回原始值

      return Reflect.get(target, key);
    },

    set(target, key, value) {
      const oldValue = Reflect.get(target, key);
      printWarn(`Set operation on key '${key.toString()}' failed: target is readonly.`, { [key.toString()]: oldValue });
      return oldValue;
    },

    deleteProperty(target, key) {
      const oldValue = Reflect.get(target, key);
      printWarn(`Delete operation on key '${key.toString()}' failed: target is readonly.`, { [key.toString()]: oldValue });
      return oldValue;
    }

  })
}

/**
 * 检测是否为 readonly 对象
 * @param proxy 
 * @returns 
 */
export function isReadonly(proxy: AnyObj) {
  return proxy && readonly(proxy)[ReactiveFlags.IS_READONLY];
}
