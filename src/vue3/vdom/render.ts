import { createElement } from "./create-element";
import { isAssignmentValueToNode, isType, noRenderValue } from "../utils/judge";

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
  if (noRenderValue(children)) return '';

  if (typeof tag === 'string') {
    // 属性值拼接
    let attrStr = '';
    for (const attr in attrs) {
      attrStr += ` ${attr}=${attrs[attr]}`;
    }

    // 子节点拼接
    let text = '';
    if (typeof children === 'function') {
      text = children();
    } else if (isAssignmentValueToNode(children)) {
      text = children;
    } else if (children instanceof Array) {
      children.forEach(val => {
        if (isType(val) === 'object') {
          text += renderToString(val);
        } else if (typeof val === 'function') {
          const value = val();
          if (isAssignmentValueToNode(value)) {
            text += value.toString();
          } else if (isType(value) === 'object') {
            text += renderToString(value);
          }
        } else if (isAssignmentValueToNode(val)) {
          text += val;
        } else if (val instanceof Array) {
          val.forEach(item => {
            text += renderToString(item);
          })
        }
      })
    }

    return `<${tag}${attrStr}>${text}</${tag}>`;
  } else if (typeof tag === 'function') {
    if (tag.name === 'Fragment') {
      let html = '';
      children.forEach(val => {
        html += renderToString(val);
      })
      return html;
    } else {
      return renderToString(tag(attrs));
    }
  }
}