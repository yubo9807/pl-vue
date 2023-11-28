import { binding } from "../reactivity";
import { objectAssign, AnyObj, createId, printWarn, isArray, isEquals, isFunction, isObject, isString } from '../utils';
import { isAssignmentValueToNode, isReactiveChangeAttr, isVirtualDomObject, isComponent, noRenderValue, createTextNode } from "./utils"
import { isFragment } from "./h";
import { Tag, Attrs, Children, Tree, Component } from "./type";
import { compTreeMap, filterElement } from './component-tree';
import { triggerBeforeUnmount } from "./hooks/before-unmount";
import { triggerUnmounted } from "./hooks/unmounted";
import { collectExportsData, recordCurrentComp } from "./instance";



/**
 * 创建元素
 * @param tag 
 * @param attrs 
 * @param children 
 * @returns 
 */
export function createElement(tag: Tag, attrs: Attrs, children: Children) {
  if (isString(tag)) {  // 节点
    return createElementReal(tag, attrs, children);
  }
  if (isFragment(tag)) {  // 节点片段
    return createElementFragment(children);
  }
  if (isComponent(tag)) {  // 组件
    tag = tag as Component;
    tag.prototype._id = createId();
    recordCurrentComp(tag);
    const props = objectAssign(attrs, { children });
    const tree = tag(props);
    collectExportsData(tag, attrs);
    if (isAssignmentValueToNode(tree)) {  // 可能直接返回字符串数字
      return createTextNode(tree);
    }
    compTreeMap.set(tag, filterElement(tree.children));  // 收集组件
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

    if (noRenderValue(val)) return;

    // 原始值
    if (isAssignmentValueToNode(val)) {
      const textNode = createTextNode(val);
      textNode.nodeValue = val;
      el.appendChild(textNode);
      return;
    }

    // 响应式数据
    if (isFunction(val)) {
      const fragment = createElementFragment([val]);
      el.appendChild(fragment);
      return;
    }

    // 节点片段
    if (isArray(val)) {
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

    if (isObject(val) && isComponent(val.tag)) {
      const node = createElement(val.tag, val.attrs, val.children);
      el.appendChild(node);
      return;
    }

    printWarn(`render: 不支持 ${val} 值渲染`);

  })

  // attrs 赋值
  for (const attr in attrs) {
    const value = attrs[attr];
    if ([void 0, null].includes(value)) continue;

    if (attr.startsWith('data-')) {
      el.dataset[attr.slice(5)] = value;
      continue;
    }

    if (attr === 'ref') {
      value.value = el;
      continue;
    }

    if (attr === 'created' && isFunction(value)) {
      value(el);
      continue;
    } 

    if (isFunction(value) && isReactiveChangeAttr(attr)) {
      binding(() => {
        el[attr] = value();
      })
      continue;
    }

    el[attr] = value;
  }

  // 对样式单独处理
  if (attrs.style && isObject(attrs.style)) {
    for (const prop in attrs.style) {
      const value = attrs.style[prop];
      if (isFunction(value)) {
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
export function createElementFragment(children: Children) {

  const fragment = document.createDocumentFragment();

  children.forEach(val => {

    if (noRenderValue(val)) return;

    // 原始值
    if (isAssignmentValueToNode(val)) {
      const textNode = createTextNode(val);
      textNode.nodeValue = val;
      fragment.appendChild(textNode);
      return;
    }

    // 响应式数据
    if (isFunction(val)) {
      reactivityNode(fragment, val);
      return;
    }
  
    // 节点片段
    if (isArray(val)) {
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

    // 组件
    if (isObject(val) && isComponent(val.tag)) {
      const node = createElement(val.tag, val.attrs, val.children);
      fragment.appendChild(node);
      return;
    }

    printWarn(`render: 不支持 ${val} 值渲染`);

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
    return createTextNode(value);
  }

  // 节点
  if (isVirtualDomObject(value)) {
    return createElement(value.tag, value.attrs, value.children);
  }

  // 组件
  if (isObject(value) && isComponent(value.tag)) {
    return createElement(value.tag, value.attrs, value.children);
  }

}


type BackupNode = {
  key: number
  tree: Tree
  node: HTMLElement
}

/**
 * 查询备份数据中是否存在（二分）
 * @param arr 
 * @param val 
 * @returns 
 */
function lookupBackupNodes(arr: BackupNode[], val: number) {
  let start = 0;
  let end = arr.length - 1;
  while (start <= end) {
    var midden = Math.ceil((start + end) / 2);
    if(val === arr[midden].key) {
      return midden;
    } else if (val < arr[midden].key) {  // 在左边
      end = midden - 1;
    } else if (val > arr[midden].key) {  // 在右边
      start = midden + 1;
    }
  }
  return -1;
}

/**
 * 响应式节点变化
 * @param fragment 
 * @param val 
 */
function reactivityNode(fragment: DocumentFragment, val: () => any) {
  let backupNodes: BackupNode[] = [];
  let lockFirstRun = true;  // 锁：第一次运行
  let parent = null;

  const textNode = createTextNode('');  // 用于记录添加位置
  fragment.appendChild(textNode);

  binding(() => {
    let value = val();
    if (value && isObject(value) && isFragment(value.tag)) {
      printWarn('不支持响应式节点片段渲染');
      return;
    }

    if (!isArray(value)) {
      value = [value];
    }
    value = value.filter(val => !noRenderValue(val));

    let i = 0;
    while (i < value.length) {
      let val = value[i];

      const index = lookupBackupNodes(backupNodes, i);
      if (index >= 0) {  // 节点已经存在
        if (isEquals(val, backupNodes[index].tree)) {  // 任何数据都没有变化
          i++;
          continue;
        }

        // 节点替换，重新备份
        const node = createNode(val);
        if (!node) {  // 创建节点失败，有可能原节点被删除
          value.splice(index, 1);
          i++;
          continue;
        }
        const originTree = backupNodes[index].tree;

        isComponent(originTree.tag) && triggerBeforeUnmount(originTree.tag as Component);  // 组件卸载之前
        backupNodes[index].node.parentElement.replaceChild(node, backupNodes[index].node);
        if (isComponent(originTree.tag)) {                                                 // 组件卸载之后
          const comp = originTree.tag as Component;
          triggerUnmounted(comp);
          compTreeMap.delete(comp);
        }

        backupNodes[index].tree = val;
        backupNodes[index].node = node;
      } else {  // 节点不存在，追加节点
        const node = createNode(val);
        if (!node) {  // 创建节点失败，有可能原节点被删除
          i++;
          continue;
        }

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
        backupNodes.push({ key: i, tree: val, node });
      }

      i++;
    }

    // 检查有没有要删除的节点
    if (backupNodes.length > value.length) {
      for (let i = value.length; i < backupNodes.length; i ++) {
        const originTree = backupNodes[i].tree;

        isComponent(originTree.tag) && triggerBeforeUnmount(originTree.tag as Component);  // 组件卸载之前
        backupNodes[i].node.remove();
        if (isComponent(originTree.tag)) {                                                 // 组件卸载之后
          const comp = originTree.tag as Component;
          triggerUnmounted(comp);
          compTreeMap.delete(comp);
        }

      }
      backupNodes.splice(value.length, backupNodes.length - value.length);
    }

    lockFirstRun = false;
  })
}
