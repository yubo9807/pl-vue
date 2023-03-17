import { hasOwn, isObject } from "../utils/judge";
import { AnyObj } from "../utils/type";
import { isReadonly } from "./readonly";

let func = null;
const funcsMap: WeakMap<object, Function[]> = new WeakMap();  // 搜集依赖的 map 集合

/**
 * 绑定响应式对象
 * @param fn 将响应式对象写在 fn 内，该对象重新赋值时会自行触发 fn()
 * 当返回 true 时，该函数将在依赖收集中删除，避免占用过多的内存
 */
export function binding(fn: Function) {
  func = fn;
  fn();  // 自执行触发 get 方法，方法被保存
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
export function reactive<T extends AnyObj>(target: T): T {

  if (!isObject(target) || rawMap.get(target)) return target;

  return new Proxy(target, {

    // 获取
    get(target, key, receiver) {
      if (key === ReactiveFlags.RAW) return target;  // 返回原始值

      // 依赖收集
      const funcs = funcsMap.get(target) || [];
      func && funcs.push(func);
      funcsMap.set(target, funcs);

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
        distributeUpdates(target);
      }

      return result;
    },



    // 删除
    deleteProperty(target, key) {

      const hasKey = hasOwn(target, key);
      const result = Reflect.deleteProperty(target, key);

      if (hasKey && result) {
        // console.log(`%c delete ${isType(target)}[${key.toString()}]`, 'color: red');
        distributeUpdates(target);
      }

      return result;
    }

  })

}


/**
 * 派发更新
 * @param key 存入 funcsMap 的键
 */
function distributeUpdates(key) {
  const funcs = funcsMap.get(key);
  funcs && funcs.forEach((fn, index) => {
    const del = fn();
    // 清理下内存，将不用的函数删除
    if (typeof del === 'boolean' && del) {
      funcs.splice(index, 1);
      funcsMap.set(key, funcs);
    }
  });
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
  if (isObject(obj)) rawMap.set(obj, true);
  return obj;
}
