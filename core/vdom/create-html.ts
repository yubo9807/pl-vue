import { customForEach, isArray, isFunction, isObject, isString, objectAssign, printWarn } from "../utils";
import { isAssignmentValueToNode, isClassComponent, isComponent, isReactiveChangeAttr, joinClass } from "./utils";
import { isFragment } from "./h";
import { Attrs, BaseComponent, Children, Tag } from "./type";


/**
 * 创建 innerHTML，用于服务端渲染
 * @param tag 
 * @param attrs 
 * @param children 
 */
export function createHTML(tag: Tag, attrs: Attrs = {}, children: Children = ['']) {
  // 节点片段
  if (isFragment(tag)) {
    const props = objectAssign(attrs, { children });
    const h = (tag as Function)(props);
    return createHTMLFragment(h);
  }

  // 组件
  if (isComponent(tag)) {
    tag = tag as BaseComponent;
    if (isClassComponent(tag)) {
      return createHTML(tag.prototype.render, {}, []);
    }
    const props = objectAssign(attrs, { children });
    const h = (tag as Function)(props);
    return createHTML(h.tag, h.attrs, h.children);
  } 

  // 属性
  let attrStr = '';

  for (const attr in attrs) {
    if (attr.startsWith('on') || attr === 'ref') continue;

    let value = isFunction(attrs[attr]) && isReactiveChangeAttr(attr) ? attrs[attr]() : attrs[attr];

    if (isString(tag) && ['innerHTML', 'innerText'].includes(attr)) {
      children = [value];
      continue;
    }

    if (attr === 'className') {
      value && (attrStr += ` class="${joinClass(...[value].flat())}"`);
      continue;
    }

    // 对样式单独做下处理
    if (attr === 'style' && isObject(value)) {
      for (const key in value) {
        if (isFunction(value[key])) {  // 响应式数据
          value[key] = value[key]();
        }
      }
      value = '"' + JSON.stringify(value).slice(1, -1).replace(/"/g, '').replace(/,/g, ';') + '"';
    }

    attrStr += ` ${attr}="${value}"`;
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
export function createHTMLFragment(children: Children) {
  let text = '';
  customForEach(children, val => {

    // 原始值
    if (isAssignmentValueToNode(val)) {
      text += val.toString();
      return;
    }

    // 节点片段
    if (isArray(val)) {
      text += createHTMLFragment(val);
      return;
    }

    // 响应式数据
    if (isFunction(val)) {
      const value = val();
      text += createHTMLFragment([value]);
      return;
    }

    // 节点 || 组件 || 虚拟节点
    if (isObject(val)) {
      text += createHTML(val.tag, val.attrs, val.children);
      return;
    }

    printWarn(`renderToString: 不支持 ${val} 值渲染`);

  })
  return text;
}
