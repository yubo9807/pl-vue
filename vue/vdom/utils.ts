import { isType } from "../utils/judge";
import { isFragment } from "./h";

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
  return !/^on/.test(attr);
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
  return typeof tag === 'function' && !isFragment(tag);
}

/**
 * 不进行渲染的值
 * @param value 
 * @returns 
 */
export function noRenderValue(value: any) {
  return [void 0, null, '', true, false].includes(value);
}