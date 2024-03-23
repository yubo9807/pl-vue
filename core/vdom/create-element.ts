import { binding } from "../reactivity";
import { objectAssign, AnyObj, printWarn, isArray, isEquals, isFunction, isObject, isString, len, customForEach } from '../utils';
import { isAssignmentValueToNode, isReactiveChangeAttr, isVirtualDomObject, isComponent, noRenderValue, createTextNode, appendChild, joinClass, isClassComponent } from "./utils"
import { isFragment } from "./h";
import { Tag, Attrs, Children, Tree, Component, BaseComponent } from "./type";
import { compTreeMap, filterElement } from './component-tree';
import { triggerBeforeUnmount } from "./hooks/before-unmount";
import { triggerUnmounted } from "./hooks/unmounted";
import { collectExportsData, recordCurrentComp } from "./instance";
import { getGlobalComponent } from "./component-global";



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
  if (isFunction(tag)) {  
    tag = tag as BaseComponent;

    // 节点片段
    if (isFragment(tag)) {  
      return createElementFragment(children);
    }

    recordCurrentComp(tag);

    // 类组件
    if (isClassComponent(tag)) {
      // @ts-ignore
      const t = new tag({ ...attrs, children });
      tag = t.render.bind(t);
    }

    // 组件
    tag = tag as BaseComponent
    const props = objectAssign(attrs, { children });
    const tree = tag(props);
    collectExportsData(tag, attrs);
    if (isAssignmentValueToNode(tree)) {  // 可能直接返回字符串数字
      return createTextNode(tree);
    }
    compTreeMap.set(tag, filterElement([tree, ...tree.children]));  // 收集组件
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

  if (isFunction(tag) && isFragment(tag as Function)) {
    return createElement(tag, attrs, children);
  }

  const globalComp = getGlobalComponent(tag as string);
  if (globalComp) {
    return createElement(globalComp, attrs, children);
  }

  const el = document.createElement(tag as string);

  customForEach(children, val => {
    if (isFunction(val)) {
      const fragment = createElementFragment([val]);
      appendChild(el, fragment);  // 响应式数据交给节点片段去处理
    } else {
      nodeMount(el, val);
    }
  })

  // attrs 赋值
  for (const attr in attrs) {
    attrAssign(el, attr, attrs[attr]);
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
 * 属性赋值
 * @param el 
 * @param attr 
 * @param value 
 */
function attrAssign(el: HTMLElement, attr: string, value: any) {
  // 自定义属性
  if (attr === 'ref' && isObject(value)) {
    value.value = el;
    return;
  }
  if (attr === 'created' && isFunction(value)) {
    value(el);
    return;
  }

  // 一般属性赋值
  let assgin = (val: string) => el[attr] = val;

  // 特殊属性处理
  if (attr === 'className') {
    assgin = (val: string) => el[attr] = joinClass(...[val].flat());
  } else if (attr.startsWith('data-')) {
    assgin = (val: string) => el.dataset[attr.slice(5)] = val;
  }

  // 响应式数据
  if (isReactiveChangeAttr(attr) && isFunction(value)) {
    binding(() => assgin(value()));
  } else {
    assgin(value);
  }
}



/**
 * 创建节点片段
 * @param children 
 * @returns 
 */
export function createElementFragment(children: Children) {

  const fragment = document.createDocumentFragment();

  customForEach(children, val => {
    if (isFunction(val)) {
      reactivityNode(fragment, val);  // 响应式数据挂载
    } else {
      nodeMount(fragment, val);
    }
  })

  return fragment;

}

/**
 * 节点挂载
 * @param el 
 * @param val 
 */
function nodeMount(el: HTMLElement | DocumentFragment, val: any) {
  if (noRenderValue(val)) return;

  // 原始值
  if (isAssignmentValueToNode(val)) {
    const textNode = createTextNode(val);
    textNode.nodeValue = val;
    appendChild(el, textNode);
    return;
  }

  // 节点片段
  if (isArray(val)) {
    const fragment = createElementFragment(val);
    appendChild(el, fragment);
    return;
  }

  // 节点
  if (isVirtualDomObject(val)) {
    const node = createElementReal(val.tag, val.attrs, val.children);
    appendChild(el, node);
    return;
  }

  // 组件
  if (isObject(val) && isComponent(val.tag)) {
    const node = createElement(val.tag, val.attrs, val.children);
    appendChild(el, node);
    return;
  }

  printWarn(`render: 不支持 ${val} 值渲染`);

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
 * @param value 
 * @returns 
 */
function lookupBackupNodes(arr: BackupNode[], value: number) {
  let start = 0;
  let end = len(arr) - 1;
  while (start <= end) {
    const midden = Math.ceil((start + end) / 2);
    const val = arr[midden];
    if(value === val.key) {
      return midden;
    } else if (value < val.key) {  // 在左边
      end = midden - 1;
    } else if (value > val.key) {  // 在右边
      start = midden + 1;
    }
  }
  return -1;
}

/**
 * 响应式节点变化
 * @param fragment 
 * @param func 
 */
function reactivityNode(fragment: DocumentFragment, func: () => any) {
  let backupNodes: BackupNode[] = [];
  let lockFirstRun = true;  // 锁：第一次运行
  let parent = null;

  const textNode = createTextNode('');  // 用于记录添加位置
  appendChild(fragment, textNode);

  binding(() => {
    let value = func();
    if (value && isObject(value) && isFragment(value.tag)) {
      printWarn('不支持响应式节点片段渲染');
      return;
    }

    if (!isArray(value)) value = [value];
    value = value.filter(val => !noRenderValue(val));

    let i = 0;
    while (i < len(value)) {
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
          appendChild(fragment, node);
        } else if (len(backupNodes) === 0) {
          parent ??= textNode.parentElement;
          parent.insertBefore(node, textNode.nextSibling);
        } else {
          const prevNode = backupNodes[len(backupNodes) - 1].node;
          const lastNode = prevNode.nextSibling;
          prevNode.parentElement.insertBefore(node, lastNode);
        }
        backupNodes.push({ key: i, tree: val, node });
      }

      i++;
    }

    // 检查有没有要删除的节点
    if (len(backupNodes) > len(value)) {
      for (let i = len(value); i < len(backupNodes); i ++) {
        const originTree = backupNodes[i].tree;

        isComponent(originTree.tag) && triggerBeforeUnmount(originTree.tag as Component);  // 组件卸载之前
        backupNodes[i].node.remove();
        if (isComponent(originTree.tag)) {                                                 // 组件卸载之后
          const comp = originTree.tag as Component;
          triggerUnmounted(comp);
          compTreeMap.delete(comp);
        }

      }
      backupNodes.splice(len(value), len(backupNodes) - len(value));
    }

    lockFirstRun = false;
  })
}
