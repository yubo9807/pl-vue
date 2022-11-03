import { hasOwn, isObject, isType } from "../utils/judge";
import { AnyObj } from "../utils/type";

export const ReactiveFlags = {
  RAW:         Symbol('__v_raw'),
  IS_READONLY: Symbol('__v_isReadonly'),
}

/**
 * 将数据变为响应式数据（深度）
 * @param target 
 * @returns 
 */
export function reactive(target: AnyObj) {

  return new Proxy(target, {

    // 获取
    get(target, key, receiver) {
      if (key === ReactiveFlags.RAW) return target;  // 返回原始值

      const result = Reflect.get(target, key, receiver);
      return isObject(result) ? reactive(result) : result;
    },



    // 赋值/修改
    set(target, key, value, receiver) {

      const oldValue = Reflect.get(target, key, receiver);
      const result   = Reflect.set(target, key, value, receiver);

      if (target[ReactiveFlags.IS_READONLY]) {
        return oldValue;
      }

      if (result && oldValue !== value) {
        console.log(`%c update ${isType(target)}[${key.toString()}]: ${oldValue} --> ${value}`, 'color: orange');
        // 更新操作 ...
      }

      return result;
    },



    // 删除
    deleteProperty(target, key) {

      const hasKey = hasOwn(target, key);
      const result = Reflect.deleteProperty(target, key);

      if (hasKey && result) {
        console.log(`%c delete ${isType(target)}[${key.toString()}]`, 'color: red');
        // 更新操作 ...
      }

      return result;
    }

  })

}

/**
 * 判断是否为 reactive 对象
 * @param reactive 
 * @returns 
 */
export function isReactive(reactive: unknown) {
  return !!reactive[ReactiveFlags.RAW];
}

/**
 * reactive 对象转普通对象
 * @param reactive 
 * @returns 
 */
export function toRaw(reactive: AnyObj) {
  return isReactive(reactive) ? reactive[ReactiveFlags.RAW] : reactive;
}



