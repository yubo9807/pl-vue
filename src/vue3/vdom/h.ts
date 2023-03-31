import { AnyObj } from "../utils/type";

export function h(tag: string, attrs: AnyObj, ...children: any[]) {
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