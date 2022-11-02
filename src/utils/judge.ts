import { Key } from "./type";

export type Type = 'string'    | 'number'  | 'boolean' |
                   'symbol'    | 'bigint'  |
                   'undefined' | 'null'    |
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
export function isObject(o: any) {
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
