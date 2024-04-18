import { len } from "./string";
import { AnyObj, Key, WideClass } from "./type";

export type Type = 'String'    | 'Number'  | 'Boolean' |
                   'Symbol'    | 'Bigint'  |
                   'Undefined' | 'Null'    |
                   'regexp'    | 'Date'    |
                   'Array'     | 'Object'  |
                   'Function'  | 'Promise' |
                   'Set'       | 'Map'     |
                   'WeakSet'   | 'WeakMap' | 'WeakRef'

/**
 * 属于什么类型
 * @param o
 */
export function isType(o: any): Type {
  return Object.prototype.toString.call(o).slice(8, -1);
}

/**
 * 函数是否是为类声明
 * @param func 
 * @returns 
 */
export function isClass(func: Function): func is WideClass {
  return func.toString().slice(0, 5) === 'class';
}

/**
 * 是否属于自己的属性
 * @param target 
 * @param key 
 * @returns 
 */
export function hasOwn(target: object | any[], key: Key) {
  return Object.prototype.hasOwnProperty.call(target, key);
}

/**
 * 判断两个值是否相等
 * @param val1 
 * @param val2 
 * @returns 
 */
export function isEquals(val1: any, val2: any) {
  if (isObject(val1) && isObject(val2)) {
    const keys1 = Object.keys(val1), keys2 = Object.keys(val2);
    if (len(keys1) !== len(keys2)) return false;
    for (const key of keys1) {
      if (!keys2.includes(key)) return false;
      const bool = isEquals(val1[key], val2[key]);
      if (!bool) return false;
    }
    return true;
  } else {
    return val1 === val2;
  }
}

/**
 * 是否为浏览器环境
 * @returns 
 */
export function isBrowser() {
  return typeof window === 'object';
}

/**
 * 是否为 object 类型，包含 class
 * @param obj 
 * @returns 
 */
export function isObject(obj: AnyObj): obj is AnyObj {
  return typeof obj === 'object' && obj !== null;
}

/**
 * 是否为一个普通的对象
 * @param obj 
 * @returns 
 */
export function isNormalObject(obj: AnyObj): obj is AnyObj {
  return isStrictObject(obj) || isType(obj) === 'Array';
}

/**
 * 是否为一个严格的对象
 * @param obj 
 * @returns 
 */
export function isStrictObject(obj: AnyObj): obj is AnyObj {
  return isType(obj) === 'Object';
}

/**
 * 是 array 类型
 * @param obj 
 * @returns 
 */
export function isArray(arr: AnyObj): arr is any[] {
  return Array.isArray(arr);
}

/**
 * 是 string 类型
 * @param obj 
 * @returns 
 */
export function isString(text: any): text is string {
  return typeof text === 'string';
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}
