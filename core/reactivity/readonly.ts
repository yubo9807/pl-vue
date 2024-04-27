import { AnyObj } from "../utils";
import { IS_READONLY, proxy } from "./proxy";

/**
 * 将对象转为只读
 * @param target 
 * @returns 
 */
export function readonly(target: AnyObj) {
  return proxy(target, { readonly: true });
}

/**
 * 检测是否为 readonly 对象
 * @param proxy 
 * @returns 
 */
export function isReadonly(proxy: AnyObj) {
  return proxy && readonly(proxy)[IS_READONLY];
}

/**
 * readonly 的浅层作用形式
 * @param target 
 * @returns 
 */
export function shallowReadonly(target: any[]) {
  return proxy(target, {
    shallow:  true,
    readonly: true,
  });
}
