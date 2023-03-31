import { binding } from "../reactivity/depend";
import { isAssignmentValueToNode, isType } from "../utils/judge"
import { clone } from "../utils/object";
import { AnyObj } from "../utils/type";
import { isFragment } from "./h";

type Tag = string | Function
type Attrs = AnyObj
type Children = any[]



/**
 * 对 dom 树简单的做下处理，去掉包裹的组件层
 * @param tag 
 * @param attrs 
 * @param children 
 * @returns 
 */
export function createTree(tag: Tag, attrs: Attrs = {}, children: Children = []) {
  
  if (typeof tag === 'function' && !isFragment(tag)) {  // 组件
    const props = clone(Object.assign({}, attrs, { children }));
    const h = tag(props);
    return createTree(h.tag, h.attrs, h.children);
  }


  const newChildren = []
  children.forEach(val => {
    if (isType(val) === 'object') {
      const h = createTree(val.tag, val.attrs, val.children);
      newChildren.push(h);
    } else {
      newChildren.push(val);
    }
  })
  return { tag, attrs, children: newChildren };
}




/**
 * 创建元素
 * @param tag 
 * @param attrs 
 * @param children 
 * @returns 
 */
export function createElement(tag: Tag, attrs: Attrs, children: Children) {
  if (typeof tag === 'string') {
    return createElementReal(tag, attrs, children)
  }
  if (isFragment(tag)) {  // 节点片段
    return createElementFragment(children);
  }
}




/**
 * 创建真实节点
 * @param tag 
 * @param attrs 
 * @param children 
 * @returns 
 */
function createElementReal(tag: Tag, attrs: AnyObj = {}, children: Children = ['']) {

  if (isFragment(tag)) {
    return createElement(tag, attrs, children);
  }

  const el = document.createElement(tag as string);

  children.forEach(val => {

    // 原始值
    if (isAssignmentValueToNode(val)) {
      const textNode = document.createTextNode(val);
      textNode.nodeValue = val;
      el.appendChild(textNode);
      return;
    }
  
    // 响应式数据
    if (typeof val === 'function') {
      const fragment = createElementFragment([val]);
      el.appendChild(fragment);
      return;
    }
  
    // 节点片段
    if (val instanceof Array) {
      const fragment = createElementFragment(val);
      el.appendChild(fragment);
      return;
    }
  
    // 节点
    if (isType(val) === 'object') {
      const node = createElementReal(val.tag, val.attrs, val.children);
      el.appendChild(node);
      return;
    }

  })

  // attrs 赋值
  for (const prop in attrs) {
    el[prop] = attrs[prop];
  }

  // 对样式单独处理
  if (attrs.style && attrs.style instanceof Object) {
    for (const prop in attrs.style) {
      const value = attrs.style[prop];
      if (typeof value === 'function') {
        binding(() => el.style[prop] = value());
      } else {
        el.style[prop] = value;
      }
    }
  }

  return el;

}




/**
 * 创建节点片段
 * @param children 
 * @returns 
 */
function createElementFragment(children: Children) {

  const fragment = document.createDocumentFragment();

  children.forEach(val => {

    // 原始值
    if (isAssignmentValueToNode(val)) {
      const textNode = document.createTextNode(val);
      textNode.nodeValue = val;
      fragment.appendChild(textNode);
      return;
    }
  
    // 响应式数据
    if (typeof val === 'function') {
      const textNode = document.createTextNode('');
      let backupNode = null;

      binding(() => {
        const value = val();

        if (isAssignmentValueToNode(value)) {
          textNode.nodeValue = value.toString();
          if (backupNode !== null) {
            backupNode.parentElement.replaceChild(textNode, backupNode);
          }
          backupNode = textNode;
        } else if (isType(value) === 'object') {
          const node = createElement(value.tag, value.attrs, value.children);
          backupNode ? backupNode.parentElement.replaceChild(node, backupNode) : fragment.appendChild(node)
          backupNode = node;
        } else if (value instanceof Array) {
          console.warn('暂不支持直接返回一个数组，请包裹一层标签')
        }
      })
      fragment.appendChild(textNode);
      return;
    }
  
    // 节点片段
    if (val instanceof Array) {
      const fragmentNode = createElementFragment(val);
      fragment.appendChild(fragmentNode);
      return;
    }
  
    // 节点
    if (isType(val) === 'object') {
      const node = createElementReal(val.tag, val.attrs, val.children);
      fragment.appendChild(node);
      return;
    }

  })

  return fragment;

}



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

    let value = attrs[attr];

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
    if (isType(val) === 'object') {
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

  })
  return text;
}
