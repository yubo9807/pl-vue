import { Attrs, Children, Component } from './type';
import { isAssignmentValueToNode, isComponent } from './utils';
import { isObject } from '../utils/judge';
import { clone, objectAssign } from '../utils/object';

type CompTree = {
  compId:    string
  comp:      Component
  props:     Attrs
  children?: Children
}
export const compTreeMap: WeakMap<Component, CompTree[]> = new WeakMap();

/**
 * 过滤掉元素，对组件进行收集
 * @param children 
 * @param collect  递归参数，无需传递
 * @returns 
 */
export function filterElement(children: Children, collect: CompTree[] = []) {
  children.forEach(tree => {
    if (isObject(tree)) {
      if (isComponent(tree.tag)) {
        collect.push({ comp: tree.tag, compId: tree.tag.prototype._id, props: objectAssign(tree.attrs, { children }) });
      } else if (isAssignmentValueToNode(tree.tag)) {
        filterElement(tree.children, collect);
      }
    }
  })
  return collect;
}

/**
 * 获取一个组件下所有的子组件
 * @param comp    组件
 * @param collect 递归参数，无需传递
 * @returns 
 */
export function getSubComponent(comp: Component, collect: CompTree[] = []) {
  const arr = compTreeMap.get(comp) || [];
  collect.push(...arr);
  arr.forEach(val => {
    const arr = getSubComponent(val.comp);
    collect.push(...arr);
  })
  return collect;
}

/**
 * 获取组件树型结构
 * @param comp 组件
 */
export function getComponentTree(comp: Component): CompTree[] {
  const arr = clone(compTreeMap.get(comp)) || [];
  arr.forEach(val => {
    val.children = getComponentTree(val.comp);
  })
  return arr;
}