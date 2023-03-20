import { createElement } from "./createElement";
import { AnyObj } from "./utils/type";

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

export function render({ tag, attrs, children }) {
  return createElement(tag, attrs, children);
}