import { nextTick, hasOwn, isNormalObject, isEquals, printWarn } from "../utils";
import { dependencyCollection, distributeUpdates } from "./depend";

export const IS_RAW      = Symbol('__v_raw');
export const IS_REF      = Symbol('__v_isRef');
export const IS_SHALLOW  = Symbol('__v_isShallow');
export const IS_READONLY = Symbol('__v_isReadonly');

type Option = {
  shallow?:  boolean  // 浅响应式对象
  readonly?: boolean  // 只读对象
}
/**
 * 创建一个代理对象
 * @param target 
 * @param option 
 */
export function proxy<T extends Object>(target: T, option: Option = {}) {

  const isReadonly = !!option.readonly;
  const isShallow  = !!option.shallow;

  // readonly
  if (isReadonly) {
    Reflect.defineProperty(target, IS_READONLY, {
      value: true,
    })
  }


  const updateKeySet = new Set();  // 记录要更新的 key

  return new Proxy(target, {

    // 获取
    get(target, key, receiver) {
      if (key === IS_RAW) return target;  // 返回原始值

      const result = Reflect.get(target, key);
      if (isReadonly) return result;  // readonly

      dependencyCollection(target);   // 收集依赖

      if (isShallow) return result;   // 浅响应式
      return isNormalObject(result) ? proxy(result, option) : result;
    },


    // 赋值/修改
    set(target, key, value, receiver) {
      if (target[IS_READONLY]) return true;

      const oldValue = Reflect.get(target, key);

      // readonly
      if (isReadonly) {
        printWarn(`Set operation on key '${key.toString()}' failed: target is readonly.`, { [key.toString()]: oldValue });
        return true;
      }

      if (isEquals(oldValue, value)) return true;
      const result = Reflect.set(target, key, value);

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

      const oldValue = Reflect.get(target, key);

      // readonly
      if (isReadonly) {
        printWarn(`Delete operation on key '${key.toString()}' failed: target is readonly.`, { [key.toString()]: oldValue });
        return true;
      }

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