import { AnyObj, Key } from "./type";

export type Type = 'string'    | 'number'  | 'boolean' |
                   'symbol'    | 'bigint'  |
                   'undefined' | 'null'    |
                   'regexp'    | 'date'    |
                   'array'     | 'object'  |
                   'function'  | 'promise' |
                   'set'       | 'map'     |
                   'weakset'   | 'weakmap' | 'weakref'

/**
 * 属于什么类型
 * @param o
 */
export function isType(o: any): Type {
  return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
}

/**
 * 从内存上看是否是一个对象
 * @param o
 */
export function isMemoryObject(o: any) {
  return ['object', 'array'].includes(isType(o));
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
  if (['object', 'array'].includes(isType(val1)) && ['object', 'array'].includes(isType(val2))) {
    const keys1 = Object.keys(val1), keys2 = Object.keys(val2);
    if (keys1.length !== keys2.length) return false;
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



// #region 减少打包代码体积
/**
 * 是 object 类型
 * @param obj 
 * @returns 
 */
export function isObject(obj: AnyObj) {
  return isType(obj) === 'object';
}

/**
 * 是 string 类型
 * @param obj 
 * @returns 
 */
export function isString(text: any) {
  return typeof text === 'string';
}
// #region
