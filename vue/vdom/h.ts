import { createId } from "../utils/string";
import { Attrs, Children, Tag } from "./type";
import { isComponent } from "./utils";

export function h(tag: Tag, attrs: Attrs, ...children: Children) {
  if (isComponent(tag)) {
    (tag as Function).prototype._id = createId();
  }
  return {
    tag,
    attrs: attrs || {},
    children,
  }
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
