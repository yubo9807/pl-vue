import { mounted } from "../hooks/mounted";
import { nextTick } from "../utils/next-tick";
import { createElement } from "./create-element";
import { createHTML } from "./create-html";

/**
 * 创建组件虚拟 DOM 树的函数
 * @param param0 
 * @returns 
 */
export function render({ tag, attrs, children }) {
  const dom = createElement(tag, attrs, children);

  if (dom instanceof DocumentFragment) {  // 节点片段
    const node = dom.children[0];
    nextTick(() => {  // 在挂载后执行
      node.parentNode && mounted();
    })
  } else if (dom instanceof HTMLElement) {
    nextTick(() => {
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
  const html = createHTML(tag, attrs, children);
  return html;
}
