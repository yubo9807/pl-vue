import { nextTick, printWarn, AnyObj, hasOwn, isObject, CustomWeakMap, isNormalObject, isEquals } from "../utils";
import { dependencyCollection, distributeUpdates } from "./depend";
import { isReadonly } from "./readonly";

const rawMap = new CustomWeakMap();

export const ReactiveFlags = {
  RAW:         Symbol('__v_raw'),
  IS_READONLY: Symbol('__v_isReadonly'),
}


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


  const updateKeySet = new Set();

  return new Proxy(target, {

    // 获取
    get(target, key, receiver) {
      if (key === ReactiveFlags.RAW) return target;  // 返回原始值

      const result = Reflect.get(target, key, receiver);
      dependencyCollection(target);
      return isNormalObject(result) ? reactive(result) : result;
    },


    // 赋值/修改
    set(target, key, value, receiver) {
      if (target[ReactiveFlags.IS_READONLY]) return true;

      let oldValue = Reflect.get(target, key, receiver);
      if (isEquals(oldValue, value)) return true;
      const result = Reflect.set(target, key, value, receiver);

      // 记录要更新的 key
      updateKeySet.add(key);
      const size = updateKeySet.size;

      nextTick(() => {  // 利用事件循环机制，防止同一时刻多次将数据更新
        if (size < updateKeySet.size) return;
        const newValue = Reflect.get(target, key);
        if (result && !isEquals(oldValue, newValue)) {
          // console.log(`%c update ${isType(target)}[${key.toString()}]: ${oldValue} --> ${value}`, 'color: orange');
          distributeUpdates(target);
        }
        updateKeySet.clear();  // 更新完成后清除记录
      })

      return result;
    },


    // 删除
    deleteProperty(target, key) {
      if (!hasOwn(target, key)) return true;  // 改对象上没有这个键

      let oldValue = Reflect.get(target, key);
      const result = Reflect.deleteProperty(target, key);

      // 记录要更新的 key
      updateKeySet.add(key);
      const size = updateKeySet.size;

      nextTick(() => {
        if (size < updateKeySet.size) return;
        const hasKey = hasOwn(target, key);      // 同一时间内，该键可能会被重新赋值。所以要保证数据真的被删
        const newValue = Reflect.get(target, key);  // 数据被删，可能又被赋值为原先的值
        if (result && !hasKey && !isEquals(oldValue, newValue)) {
          // console.log(`%c delete ${isType(target)}[${key.toString()}]`, 'color: red');
          distributeUpdates(target);
        }
        updateKeySet.clear();
      })

      return result;
    }

  })

}


/**
 * 判断是否为 reactive 对象
 * @param reactive 
 * @returns 
 */
export function isReactive<T extends AnyObj>(reactive: T): boolean {
  return isObject(reactive) && !!reactive[ReactiveFlags.RAW];
}

/**
 * reactive 对象转普通对象
 * @param reactive 
 * @returns 
 */
export function toRaw<T extends AnyObj>(reactive: T): T {
  return isReactive(reactive) ? reactive[ReactiveFlags.RAW] : reactive;
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
