import { createElement, createHTML, createTree } from "./create-element";

/**
 * 创建组件虚拟 DOM 树的函数
 * @param param0 
 * @returns 
 */
export function render({ tag, attrs, children }) {
  const tree = createTree(tag, attrs, children)
  const dom = createElement(tree.tag, tree.attrs, tree.children);
  return dom;
}

/**
 * 服务端渲染函数
 * @param param0 
 * @returns 
 */
export function renderToString({ tag, attrs, children }) {
  const tree = createTree(tag, attrs, children);
  const html = createHTML(tree.tag, tree.attrs, tree.children);
  return html;
}
