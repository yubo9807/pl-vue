import { customForEach, isArray, isFunction, isObject, isString, objectAssign, printWarn } from "../utils";
import { isAssignmentValueToNode, isClassComponent, isComponent, isReactiveChangeAttr, joinClass } from "./utils";
import { isFragment } from "./h";
import { Attrs, BaseComponent, Children, IntailOption, Tag } from "./type";
import { setLock } from "./hooks/utils";

export class Static {

  config: IntailOption
  constructor(config: IntailOption) {
    this.config = config;
  }

  /**
   * 服务端渲染函数
   * @param param0 
   * @returns 
   */
  renderToString = ({ tag, attrs, children }): string => {
    setLock(true);
    const html = this.createHTML(tag, attrs, children);
    setLock(false);
    return html;
  }

  /**
   * 创建 innerHTML，用于服务端渲染
   * @param tag 
   * @param attrs 
   * @param children 
   */
  createHTML(tag: Tag, attrs: Attrs = {}, children: Children = ['']) {
    // 节点片段
    if (isFragment(tag)) {
      const props = objectAssign(attrs, { children });
      const h = (tag as Function)(props);
      return this.createHTMLFragment(h);
    }

    // 组件
    if (isComponent(tag)) {
      tag = tag as BaseComponent;
      if (isClassComponent(tag)) {
        // @ts-ignore
        const t = new tag({ ...attrs, children });
        return this.createHTML(t.render.bind(t));
      }
      const props = objectAssign(attrs, { children });
      const h = (tag as Function)(props);
      return this.createHTML(h.tag, h.attrs, h.children);
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
    const subNodeStr = this.createHTMLFragment(children);

    return `<${tag}${attrStr}>${subNodeStr}</${tag}>`;
  }

  /**
   * 创建 innerHTML 片段
   * @param children 
   * @returns 
   */
  createHTMLFragment(children: Children) {
    let text = '';
    customForEach(children, val => {

      // 原始值
      if (isAssignmentValueToNode(val)) {
        text += val.toString();
        return;
      }

      // 节点片段
      if (isArray(val)) {
        text += this.createHTMLFragment(val);
        return;
      }

      // 响应式数据
      if (isFunction(val)) {
        const value = val();
        text += this.createHTMLFragment([value]);
        return;
      }

      // 节点 || 组件 || 虚拟节点
      if (isObject(val)) {
        text += this.createHTML(val.tag, val.attrs, val.children);
        return;
      }

      printWarn(`renderToString: 不支持 ${val} 值渲染`);

    })
    return text;
  }
}
