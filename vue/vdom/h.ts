import { createId } from "../utils/string";
import { Attrs, Children, Tag } from "./type";
import { isComponent } from "./utils";

export function h(tag: Tag, attrs: Attrs, ...children: Children) {
  const tree = {
    tag,
    attrs: attrs || {},
    children,
  }

  // 对组件做一些处理
  if (isComponent(tree.tag)) {
    (tree.tag as Function).prototype._id = createId();

    // 高阶组件 props 传递
    if (tree.children.length === 0 && tree.attrs.children) {
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
  return typeof tag === 'function' && tag.prototype[FragmentMark] === FragmentMark;
}
