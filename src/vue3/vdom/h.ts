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

export function isFragment(fn: Function) {
  return fn.prototype[FragmentMark] === FragmentMark;
}