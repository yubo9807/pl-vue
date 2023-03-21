import { binding } from "./reactivity/depend";
import { isAssignmentValueToNode, isType } from "./utils/judge";
import { AnyObj } from "./utils/type";

type Tag = string | Function
type Attrs = AnyObj
type Children = any


/**
 * 创建元素
 * @param tag 
 * @param attrs 
 * @param children 
 * @returns 
 */
export function createElement(tag: Tag, attrs: Attrs = {}, children: Children = ''): HTMLElement | DocumentFragment {
  if ([undefined, null, '', true, false].includes(children)) return;

  if (typeof tag === 'string') {
    return createElementReal(tag, attrs, children);
  } else if (typeof tag === 'function') {
    // 节点片段 <></>
    if (tag.name === 'Fragment') {
      return createElementFragment(children);
    }
    // 组件
    const h = tag(attrs);
    return createElement(h.tag, h.attrs, h.children);
  }
}

/**
 * 创建真实节点
 * @param tag 
 * @param attrs 
 * @param children 
 * @returns 
 */
function createElementReal(tag: string, attrs: Attrs = {}, children: Children = ''): HTMLElement {
  const el = document.createElement(tag);

  if (children instanceof Array) {
    children.forEach(val => {
      if (val instanceof Array) {
        el.appendChild(createElementFragment(val));
      } else if (isType(val) === 'object') {
        const node = createElement(val.tag, val.attrs, val.children);
        el.appendChild(node);
      } else if (isAssignmentValueToNode(val)) {
        const textNode = document.createTextNode(val.toString());
        el.appendChild(textNode);
      } else if (typeof val === 'function') {
        binding(() => {
          const value = val();
          if (isAssignmentValueToNode(value)) {
            const textNode = document.createTextNode(value.toString());
            el.replaceChildren('', textNode)
          } else {
            const node = createElement(value.tag, value.attrs, value.children);
            el.replaceChildren('', node)
          }
        })
      }
    })
  } else if (isAssignmentValueToNode(children)) {
    el.innerText = children.toString();
  } else if (typeof children === 'function') {
    binding(() => {
      el.innerText = children().toString();
    })
  }

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
 * 创建虚拟节点
 * @param children 
 * @returns 
 */
function createElementFragment(children: Children): DocumentFragment {
  const fragment = document.createDocumentFragment();
  if (children instanceof Array) {
    // 递归调用
    children.forEach(val => {
      if (isAssignmentValueToNode(val)) {
        const textNode = document.createTextNode(val.toString());
        fragment.appendChild(textNode);
      } else if (isType(val) === 'object') {
        const node = createElement(val.tag, val.attrs, val.children);
        fragment.appendChild(node);
      }
    })
  } else if (isAssignmentValueToNode(children)) {
    const textNode = document.createTextNode(children);
    fragment.appendChild(textNode);
  } else if (typeof children === 'function') {
    const textNode = document.createTextNode('');
    binding(() => {
      textNode.nodeValue = children();
    })
    fragment.appendChild(textNode);
  }
  return fragment;
}