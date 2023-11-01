import { nextTick } from "../utils";
import { triggerBeforeMount } from "./hooks/before-mount";
import { triggerMounted } from "./hooks/mounted";
import { setLock } from "./hooks/utils";
import { createElement } from "./create-element";
import { createHTML } from "./create-html";

/**
 * 创建组件虚拟 DOM 树的函数
 * @param param0 
 * @returns 
 */
export function render({ tag, attrs, children }) {
  const dom = createElement(tag, attrs, children);

  // 执行钩子函数
  triggerBeforeMount();
  nextTick(triggerMounted);

  return dom;
}

/**
 * 服务端渲染函数
 * @param param0 
 * @returns 
 */
export function renderToString({ tag, attrs, children }): string {
  setLock(true);
  const html = createHTML(tag, attrs, children);
  setLock(false);
  return html;
}
