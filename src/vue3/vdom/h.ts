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
