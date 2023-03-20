import { createElement } from "./createElement";

export function render({ tag, attrs, children }) {
  return createElement(tag, attrs, children);
}