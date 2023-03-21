import { createElement } from "./createElement";
import { isType } from "./utils/judge";

/**
 * 创建组件虚拟 DOM 树的函数
 * @param param0 
 * @returns 
 */
export function render({ tag, attrs, children }) {
  return createElement(tag, attrs, children);
}

/**
 * 服务端渲染函数
 * @param param0 
 * @returns 
 */
export function renderToString({ tag, attrs, children }) {
  if ([void 0, null, '', true, false].includes(children)) return '';

  let attrStr = '';
  for (const attr in attrs) {
    attrStr += ` ${attr}=${attrs[attr]}`;
  }

  let text = '';
  if (typeof children === 'function') {
    text = children();
  } else if (['string', 'number'].includes(typeof children)) {
    text = children;
  } else if (children instanceof Array) {
    children.forEach(val => {
      if (isType(val) === 'object') {
        text += renderToString(val);
      } else if (typeof val === 'function') {
        text += val();
      } else if (['string', 'number'].includes(typeof val)) {
        text += val;
      } else if (val instanceof Array) {
        val.forEach(item => {
          text += renderToString(item);
        })
      }
    })
  }

  let html = '';
  html += `<${tag}${attrStr}>${text}</${tag}>`;

  return html;
}