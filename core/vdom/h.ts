import { isFunction, len } from "../utils";
import { Attrs, Children, Component, Tag } from "./type";
import { isComponent } from "./utils";

export function h(tag: Tag, attrs: Attrs, ...children: Children) {
  const tree = {
    tag,
    attrs: attrs || {},
    children,
  }

  // 对组件做一些处理
  if (isComponent(tree.tag)) {
    // 高阶组件 props 传递
    if (len(tree.children) === 0 && tree.attrs.children) {
      tree.children = tree.attrs.children;
    }
  }

  return tree;
}

/**
 * 获取组件 id
 * @param comp 
 * @returns 
 */
export function getComponentId(comp: Component) {
  return comp.prototype._id;
}



export function Fragment({ children }) {
  return children;
}

const FragmentMark = Symbol('Fragment');
Fragment.prototype[FragmentMark] = FragmentMark;

/**
 * 是否是一个片段节点
 * @param tag 
 * @returns 
 */
export function isFragment(tag: string | Function) {
  return isFunction(tag) && (tag as Function).prototype[FragmentMark] === FragmentMark;
}
