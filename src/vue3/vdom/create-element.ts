import { binding } from "../reactivity/depend";
import { isType, isEquals } from '../utils/judge';
import { isAssignmentValueToNode, isReactiveChangeAttr, isVirtualDomObject, isComponent } from "./utils"
import { AnyObj } from "../utils/type";
import { createTree } from "./create-tree";
import { isFragment } from "./h";
import { Tag, Attrs, Children } from "./type";
import { triggerBeforeUnmount, triggerUnmounted } from "../hooks";



/**
 * 创建元素
 * @param tag 
 * @param attrs 
 * @param children 
 * @returns 
 */
export function createElement(tag: Tag, attrs: Attrs, children: Children) {
  if (typeof tag === 'string') {  // 节点
    return createElementReal(tag, attrs, children);
  }
  if (isFragment(tag)) {  // 节点片段
    return createElementFragment(children);
  }
  if (isComponent(tag)) {  // 组件
    const props = Object.assign({}, attrs, { children });
    const tree = tag(props);
    return createElement(tree.tag, tree.attrs, tree.children);
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
    if (isVirtualDomObject(val)) {
      const node = createElementReal(val.tag, val.attrs, val.children);
      el.appendChild(node);
      return;
    }

    if (isType(val) === 'object' && isComponent(val.tag)) {
      const node = createNode(val);
      el.appendChild(node);
      return;
    }

    console.warn(`render: 不支持 ${val} 值渲染`);

  })

  // attrs 赋值
  for (const attr in attrs) {
    const value = attrs[attr];
    el[attr] = value;

    if (attr === 'ref') {
      value.value = el;
    }

    if (typeof value === 'function' && isReactiveChangeAttr(attr)) {
      binding(() => {
        el[attr] = value();
      })
    }
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
      let backupNodes = [];
      let lockFirstRun = true;  // 锁：第一次运行
      let parent = null;

      const textNode = document.createTextNode('');  // 用于记录添加位置
      fragment.appendChild(textNode);

      binding(() => {
        let value = val();
        if (value && isType(value) && isFragment(value.tag)) {
          console.warn('不支持响应式节点片段渲染');
          return;
        }

        if (!(value instanceof Array)) {
          value = [value].filter(val => val);
        }

        let i = 0;
        while (i < value.length) {
          const val = value[i];

          const key = i;
          const index = backupNodes.findIndex(item => item.key === key);
          if (index >= 0) {  // 节点已经存在
            if (isEquals(val, backupNodes[index].tree)) {  // 任何数据都没有变化
              i++;
              continue;
            }

            // 节点替换，重新备份
            const node = createNode(val);
            const { tag } = backupNodes[index].tree;

            isComponent(tag) && triggerBeforeUnmount(tag);  // 组件卸载之前
            backupNodes[index].node.parentElement.replaceChild(node, backupNodes[index].node);
            isComponent(tag) && triggerUnmounted(tag);      // 组件卸载之后

            backupNodes[index].tree = val;
            backupNodes[index].node = node;
          } else {  // 节点不存在，追加节点
            const node = createNode(val);

            if (lockFirstRun) {
              fragment.appendChild(node);
            } else if (backupNodes.length === 0) {
              parent ??= textNode.parentElement;
              parent.insertBefore(node, textNode.nextSibling);
            } else {
              const prevNode = backupNodes[backupNodes.length - 1].node;
              const lastNode = prevNode.nextSibling;
              prevNode.parentElement.insertBefore(node, lastNode);
            }
            backupNodes.push({ key, tree: val, node });
          }

          i++;
        }

        // 检查有没有要删除的节点
        if (backupNodes.length > value.length) {
          for (let i = value.length; i < backupNodes.length; i ++) {
            backupNodes[i].node.remove();

            // 组件被卸载
            const { tag } = backupNodes[i].tree;
            isComponent(tag) && triggerUnmounted(tag);

            backupNodes.splice(i, 1);
          }
        }

        lockFirstRun = false;
      })

      return;
    }
  
    // 节点片段
    if (val instanceof Array) {
      const fragmentNode = createElementFragment(val);
      fragment.appendChild(fragmentNode);
      return;
    }

    // 节点
    if (isVirtualDomObject(val)) {
      const node = createElementReal(val.tag, val.attrs, val.children);
      fragment.appendChild(node);
      return;
    }

    if (isType(val) === 'object' && isComponent(val.tag)) {
      const node = createNode(val);
      fragment.appendChild(node);
      return;
    }

    console.warn(`render: 不支持 ${val} 值渲染`);

  })

  return fragment;

}



/**
 * 创建一个节点
 * @param value 
 * @returns 
 */
function createNode(value) {

  // 文本节点
  if (isAssignmentValueToNode(value)) {
    return document.createTextNode(value.toString());
  }

  // 节点
  if (isVirtualDomObject(value)) {
    return createElement(value.tag, value.attrs, value.children);
  }

  // 组件
  if (isType(value) === 'object' && isComponent(value.tag)) {
    const tree = createTree(value.tag, value.attrs, value.children);
    return createElement(tree.tag, tree.attrs, tree.children);
  }

}
