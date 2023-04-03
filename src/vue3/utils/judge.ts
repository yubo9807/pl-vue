import { isFragment } from "../vdom/h";
import { Key } from "./type";

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
export function isObject(o: any) {
  return typeof o === 'object';
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
  if (typeof val1 === 'object' && typeof val2 === 'object') {
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

/**
 * 可以直接赋值给 dom 节点
 * @param value 
 * @returns 
 */
export function isAssignmentValueToNode(value: any) {
  return ['string', 'number'].includes(typeof value) && value !== '';
}

/**
 * 可进行响应式改变的属性
 * @param attr
 */
export function isReactiveChangeAttr(attr: string) {
  return ['className', 'innerHTML', 'innerText', 'textContent'].includes(attr);
}

/**
 * 是否为一个虚拟 dom 对象
 * @param o 
 * @returns 
 */
export function isVirtualDomObject(o) {
  return isType(o) === 'object' && (typeof o.tag === 'string' || isFragment(o.tag));
}

/**
 * 是否为一个组件
 * @param o 
 * @returns 
 */
export function isComponent(tag) {
  return !isFragment(tag) && typeof tag === 'function';
}

/**
 * 不进行渲染的值
 * @param value 
 * @returns 
 */
export function noRenderValue(value: any) {
  return [void 0, null, '', true, false].includes(value);
}
