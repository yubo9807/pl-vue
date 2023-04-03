import { isAssignmentValueToNode, isReactiveChangeAttr, isVirtualDomObject } from "./utils";
import { isFragment } from "./h";
import { Attrs, Children, Tag } from "./type";
import { isType } from "../utils/judge";


/**
 * 创建 innerHTML，用于服务端渲染
 * @param tag 
 * @param attrs 
 * @param children 
 */
export function createHTML(tag: Tag, attrs: Attrs = {}, children: Children = ['']) {
  // 节点片段
  if (isFragment(tag)) {
    const props = Object.assign({}, attrs, { children });
    const h = (tag as Function)(props);
    return createHTMLFragment(h);
  }

  // 属性
  let attrStr = '';

  for (const attr in attrs) {
    if (attr.startsWith('on')) continue;

    let value = typeof attrs[attr] === 'function' && isReactiveChangeAttr(attr) ? attrs[attr]() : attrs[attr];

    if (attr === 'className') {
      attrStr += ` class=${value}`;
      continue;
    }

    // 对样式单独做下处理
    if (attr === 'style' && isType(value) === 'object') {
      for (const key in value) {
        if (typeof value[key] === 'function') {  // 响应式数据
          value[key] = value[key]();
        }
      }
      value = '"' + JSON.stringify(value).slice(1, -1).replaceAll('"', '').replaceAll(',', ';') + '"';
    }

    attrStr += ` ${attr}=${value}`;
  }

  // 子节点
  const subNodeStr = createHTMLFragment(children);

  return `<${tag}${attrStr}>${subNodeStr}</${tag}>`;

}



/**
 * 创建 innerHTML 片段
 * @param children 
 * @returns 
 */
function createHTMLFragment(children: Children) {
  let text = '';
  children.forEach(val => {

    // 原始值
    if (isAssignmentValueToNode(val)) {
      text += val.toString();
      return;
    }

    // 节点
    if (isVirtualDomObject(val)) {
      text += createHTML(val.tag, val.attrs, val.children);
      return;
    }

    // 节点片段
    if (val instanceof Array) {
      text += createHTMLFragment(val);
      return;
    }

    // 响应式数据
    if (typeof val === 'function') {
      const value = val();
      text += createHTMLFragment([value]);
      return;
    }

    console.warn(`renderToString: 不支持 ${val} 值渲染`);

  })
  return text;
}
