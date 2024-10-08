import { createId, isFunction, len } from "../utils";
import { Attrs, Children, Tag } from "./type";
import { isComponent } from "./utils";

export function h(tag: Tag, attrs: Attrs, ...children: Children) {
  const tree = {
    tag,
    attrs: attrs || {},
    children,
  }

  // 对组件做一些处理
  if (isComponent(tag)) {
    tag.prototype ||= {};
    tag.prototype.$id ||= createId();

    // 高阶组件 props 传递
    if (len(tree.children) === 0 && tree.attrs.children) {
      tree.children = tree.attrs.children;
    }
  }

  return tree;
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
  return isFunction(tag) && tag.prototype && tag.prototype[FragmentMark] === FragmentMark;
}
