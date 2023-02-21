import { binding } from "./reactivity/reactive";
import { AnyObj } from "./utils/type";

/**
 * 创建一个标签
 * @note 源码中是先生成一个 js 对象来描述 DOM 节点
 * @param tag      标签类型
 * @param props    属性
 * @param children 响应式数据请传入 function 类型 
 * @returns 
 */
export function h(tag: string, props: AnyObj = {}, children: any = '') {
  const div = document.createElement(tag);
  if (children instanceof Array) {
    children.forEach(val => div.appendChild(val));
  } else {
    for (const prop in props) {
      div[prop] = props[prop];
    }
    if (props.style && props.style instanceof Object) {
      for (const prop in props.style) {
        const value = props.style[prop];
        if (typeof value === 'function') {
          binding(() => div.style[prop] = value());
        } else {
          div.style[prop] = value;
        }
      }
    }
    if (typeof children === 'function') {
      binding(() => div.innerText = children());
    } else {
      div.innerText = children;
    }
  }
  return div;
}

/**
 * 创建一个虚拟节点片段
 * @param arr 
 * @returns 
 */
export function hFragment(arr: HTMLElement[]) {
  const fragment = document.createDocumentFragment();
  arr.forEach(val => {
    fragment.appendChild(val);
  })
  return fragment;
}
