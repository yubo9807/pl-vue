import { printWarn, AnyObj, isObject, CustomWeakMap, isNormalObject } from "../utils";
import { IS_RAW, proxy } from "./proxy";
import { isReadonly } from "./readonly";

const rawMap = new CustomWeakMap();

/**
 * 将数据变为响应式数据（深度）
 * @param target 
 * @returns 
*/
export function reactive<T extends AnyObj>(target: T): T {

  if (!isNormalObject(target) || Object.isFrozen(target)) {
    printWarn(`lue cannot be made reactive: ${target}`);
    return target;
  }
  if (rawMap.get(target)) return target;

  return proxy(target);

}


/**
 * 判断是否为 reactive 对象
 * @param reactive 
 * @returns 
 */
export function isReactive<T extends AnyObj>(reactive: T): boolean {
  return isObject(reactive) && !!reactive[IS_RAW];
}

/**
 * reactive 对象转普通对象
 * @param reactive 
 * @returns 
 */
export function toRaw<T extends AnyObj>(reactive: T): T {
  return isReactive(reactive) ? reactive[IS_RAW] : reactive;
}

/**
 * 检测是否为响应式对象
 * @param proxy 
 */
export function isProxy<T extends AnyObj>(proxy: T): boolean {
  return isReactive(proxy) || isReadonly(proxy);
}

/**
 * 标记该对象将不能设置为代理对象
 * @param obj 
 * @returns 
 */
export function markRaw<T extends AnyObj>(obj: T): T {
  if (isObject(obj)) rawMap.set(obj, true);
  return obj;
}
