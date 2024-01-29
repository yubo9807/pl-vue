import { isClass, isFunction, isObject, isString } from "../utils";
import { h, isFragment } from "./h";
import { render } from "./render";
import { BaseComponent, ClassComponent, Component } from "./type";

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
  return isObject(o) && (isString(o.tag) || isFragment(o.tag));
}

/**
 * 是否为一个组件
 * @param o 
 * @returns 
 */
export function isComponent(tag) {
  return isFunction(tag) && !isFragment(tag);
}

/**
 * 是否为一个类声明组件
 * @param o 
 * @returns 
 */
export function isClassComponent(comp: BaseComponent) {
  return isClass(comp) && comp.prototype && comp.prototype.render;
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
export function joinClass(...args: string[]) {
  const arr = args.filter(val => isAssignmentValueToNode(val))
  return arr.join(' ').trim().replace(/\s+/, ' ');
}

/**
 * 使用组件
 * @param Comp 组件函数
 * @param props     组件参数
 * @returns Node
 */
export function useComponent<C extends Component>(
  Comp: C,
  props?: C extends ClassComponent
    ? Parameters<InstanceType<typeof Comp>['render']>[0]
    : C extends BaseComponent 
    ? Parameters<typeof Comp>[0]
    : never
): HTMLElement {
  return render(h(Comp, props));
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
