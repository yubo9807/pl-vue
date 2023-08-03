import { hasOwn, isMemoryObject } from "../utils/judge";
import { nextTick } from "../utils/next-tick";
import { printWarn } from "../utils/string";
import { AnyObj } from "../utils/type";
import { dependencyCollection, distributeUpdates, clearDependencys } from "./depend";
import { isReadonly } from "./readonly";

const rawMap = new WeakMap();
const updateKeysMap: WeakMap<object, Set<string | symbol>> = new WeakMap();

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

  if (!isMemoryObject(target) || Object.isFrozen(target)) {
    printWarn(`lue cannot be made reactive: ${target}`);
    return target;
  }
  if (rawMap.get(target)) return target;

  let backupKey = null;  // 备份当前改变的 key

  return new Proxy(target, {

    // 获取
    get(target, key, receiver) {
      if (key === ReactiveFlags.RAW) return target;  // 返回原始值

      if (isMemoryObject(target[key])) {
        return reactive(target[key]);
      }

      const result = Reflect.get(target, key, receiver);
      dependencyCollection(target);
      return result;
    },



    // 赋值/修改
    set(target, key, value, receiver) {
      if (target[ReactiveFlags.IS_READONLY]) return true;

      // 如果是一个对象，需要递归去设置每个值，来确保具体更新的值
      if (isMemoryObject(target[key])) {
        const object = target[key];
        const collect: Set<string | symbol> = new Set();  // 收集已经更新的值
        for (const prop in value) {  // 重新设置每个值
          collect.add(prop);
          this.set(object, prop, value[prop], receiver[key]);
        }
        for (const prop in object) {
          if (!collect.has(prop)) {  // 需要删除的值
            this.deleteProperty(object, prop);
          }
        }
        return true;
      }
      
      const oldValue = Reflect.get(target, key, receiver);
      if (oldValue === value) return true;
      const result = Reflect.set(target, key, value, receiver);

      // 记录要更新的 key
      const updateKeys = updateKeysMap.get(target) || new Set()
      updateKeys.add(key);
      const size = updateKeys.size;
      updateKeysMap.set(target, updateKeys);

      nextTick(() => {  // 利用时间循环机制，防止同一时刻多次将数据更新
        const newValue = Reflect.get(target, key, receiver);  // 拿到最最新的值
        if (result && newValue === value && size === 1) {
          // console.log(`%c update ${isType(target)}[${key.toString()}]: ${oldValue} --> ${value}`, 'color: orange');
          distributeUpdates(target);  // 在同一时刻多次改变数据，只更新一次即可
        }
        updateKeysMap.delete(target);  // 更新完成后清除记录
      })

      return result;
    },



    // 删除
    deleteProperty(target, key) {

      const oldValue = Reflect.get(target, key);
      if (isMemoryObject(oldValue)) {
        for (const prop in oldValue) {
          this.deleteProperty(oldValue, prop);
        }
        return true;
      }

      const hasKey = hasOwn(target, key);
      const result = Reflect.deleteProperty(target, key);
      backupKey = key;
      
      nextTick(() => {
        if (hasKey && result && oldValue !== void 0 && key === backupKey) {
          // console.log(`%c delete ${isType(target)}[${key.toString()}]`, 'color: red');
          distributeUpdates(target);
          clearDependencys(target);
          backupKey = null;
        }
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
  return !!reactive[ReactiveFlags.RAW];
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
  if (isMemoryObject(obj)) rawMap.set(obj, true);
  return obj;
}
