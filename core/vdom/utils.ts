import { customForEach, isFunction, isStrictObject, isString } from "../utils";
import { isFragment } from "./h";
import { Component } from "./type";

/**
 * 可以直接赋值给 dom 节点
 * @param value 
 * @returns 
 */
export function isAssignmentValueToNode(value: any): value is string {
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
 * 是否为一个真实 dom 对象
 * @param o 
 * @returns 
 */
export function isRealNode(o) {
  return isStrictObject(o) && isString(o.tag);
}

/**
 * 是否为一个组件
 * @param o 
 * @returns 
 */
export function isComponent(tag): tag is Component {
  return isFunction(tag) && !isFragment(tag);
}

/**
 * 获取组件 id
 * @param comp 
 * @returns 
 */
export function getCompId(comp: Component) {
  return comp.prototype.$id;
}

/**
 * 不进行渲染的值
 * @param value 
 * @returns 
 */
export function noRenderValue(value: any) {
  return [void 0, null, '', true, false].includes(value);
}

/**
 * 连接 class
 * @param args 剩余参数，类名
 * @returns 
 */
export function joinClass(...args: (string | (() => string))[]) {
  const results = [];
  customForEach(args, val => {
    if (isFunction(val)) val = val();
    if (isAssignmentValueToNode(val)) {
      results.push(val);
    }
  })
  return results.join(' ').trim().replace(/\s+/, ' ');
}



// #region 减少打包代码体积
/**
 * 创建文本节点
 * @param text
 * @returns
 */
export function createTextNode(text: string) {
  return document.createTextNode(text);
}

export function appendChild(dom: Node, child: Node) {
  dom.appendChild(child);
}
// #endregion
