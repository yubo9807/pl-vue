import { mounted } from "../hooks/mounted";
import { createElement } from "./create-element";
import { createHTML } from "./create-html";
import { createTree } from "./create-tree";

/**
 * 创建组件虚拟 DOM 树的函数
 * @param param0 
 * @returns 
 */
export function render({ tag, attrs, children }) {
  const tree = createTree(tag, attrs, children)
  const dom = createElement(tree.tag, tree.attrs, tree.children);

  if (dom instanceof DocumentFragment) {  // 节点片段
    const node = dom.children[0];
    Promise.resolve().then(() => {  // 在挂载后执行
      node.parentNode && mounted();
    })
  } else if (dom instanceof HTMLElement) {
    Promise.resolve().then(() => {
      dom.parentNode && mounted();
    })
  }

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
