import { hasOwn, isObject, isType } from "../utils/judge";
import { AnyObj } from "../utils/type";
import { isReadonly } from "./readonly";

let func = null; 

/**
 * 绑定响应式对象
 * @param fn 将响应式对象写在 fn 内，该对象重新赋值时会自行触发 fn()
 */
export function binding(fn: Function) {
  func = fn;
  fn();
  func = null;
}

const rawMap = new WeakMap();

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

  if (!isObject(target)) return target;
  if (rawMap.get(target)) return target;

  const funcs: Function[] = [];

  return new Proxy(target, {

    // 获取
    get(target, key, receiver) {
      if (key === ReactiveFlags.RAW) return target;  // 返回原始值

      // 依赖收集
      func && funcs.push(func);

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
        // console.log(`%c update ${isType(target)}[${key.toString()}]: ${oldValue} --> ${value}`, 'color: orange');

        // 派发更新
        funcs.forEach(fn => fn());
      }

      return result;
    },



    // 删除
    deleteProperty(target, key) {

      const hasKey = hasOwn(target, key);
      const result = Reflect.deleteProperty(target, key);

      if (hasKey && result) {
        // console.log(`%c delete ${isType(target)}[${key.toString()}]`, 'color: red');

        // 派发更新
        funcs.forEach(fn => fn());
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

/**
 * 检测是否为响应式对象
 * @param proxy 
 */
export function isProxy(proxy: AnyObj) {
  return isReactive(proxy) || isReadonly(proxy);
}

/**
 * 标记该对象将不能设置为代理对象
 * @param obj 
 * @returns 
 */
export function markRaw(obj: AnyObj) {
  if (isObject(obj)) rawMap.set(obj, true);
  return obj;
}
