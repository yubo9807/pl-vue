import { deepClone, objectAssign, isObject, customForEach, CustomWeakMap, isEquals, isFunction } from '../utils';
import { currentComp } from './instance';
import { Attrs, Children, Component, Tree } from './type';
import { isAssignmentValueToNode, isComponent } from './utils';

type CompTree = {
  comp:      Component
  props:     Attrs
  children?: Children
}
const compTreeMap: WeakMap<Component, CompTree[]> = new CustomWeakMap();
const runFuncMap: WeakMap<Function, Component> = new CustomWeakMap();

/**
 * 过滤掉元素，对组件进行收集
 * @param children 
 * @param collect  递归参数，无需传递
 * @returns 
 */
function filterElement(children: Children, collect: CompTree[] = []) {
  customForEach(children, tree => {
    if (isFunction(tree)) {
      runFuncMap.set(tree, currentComp);
      return;
    }
    if (!isObject(tree)) return;
    if (isComponent(tree.tag)) {
      collect.push({ comp: tree.tag, props: objectAssign(tree.attrs, { children: tree.children }) });
      customForEach(tree.children, val => {
        isComponent(val) && collect.push({ comp: val, props: {} });
      })
    } else if (isAssignmentValueToNode(tree.tag)) {
      filterElement(tree.children, collect);
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
  function append(tree: CompTree) {
    const some = collect.some(val => isEquals(val, tree));
    if (some) return;
    collect.push(tree);
  }
  customForEach(arr, append);
  customForEach(arr, val => {
    const arr = getSubComponent(val.comp);
    customForEach(arr, append);
  })
  return collect;
}

/**
 * 收集组件数数据
 * @param comp 
 * @param tree 
 * @returns 
 */
export function collectComponentTree(comp: Component, tree: Tree) {
  if (!isObject(tree)) return;
  const collect = compTreeMap.get(comp) || [];
  isComponent(tree.tag)
    ? collect.push({ comp: tree.tag, props: {} })
    : collect.push(...filterElement(tree.children));
  compTreeMap.set(comp, collect);
}

/**
 * 追加组件数据
 * @param func 响应式函数，未立即渲染的
 * @param children 
 */
export function appendComponentTree(func: Function, children: Children) {
  const comp = runFuncMap.get(func);
  if (!comp) return;
  const collect = getSubComponent(comp);
  collect.push(...filterElement(children));
  compTreeMap.set(comp, collect);
}

/**
 * 清除组件树数据
 * @param comp 
 */
export function removeComponentTree(comp: Component) {
  const arr = compTreeMap.get(comp) || [];
  customForEach(arr, val => {
    compTreeMap.delete(val.comp);
  })
  compTreeMap.delete(comp);
}

/**
 * 获取组件树型结构
 * @param comp 组件
 */
export function getComponentTree(comp: Component): CompTree[] {
  const arr = deepClone(compTreeMap.get(comp)) || [];
  customForEach(arr, val => {
    val.children = getComponentTree(val.comp);
  })
  return arr;
}