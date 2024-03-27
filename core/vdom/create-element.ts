import { binding } from "../reactivity";
import { objectAssign, AnyObj, isFunction, isObject, isString, customForEach, isArray, printWarn, nextTick, len, isEquals } from '../utils';
import { isAssignmentValueToNode, isComponent, createTextNode, appendChild, isClassComponent, isRealNode, noRenderValue, joinClass, isReactiveChangeAttr } from "./utils"
import { isFragment } from "./h";
import { Attrs, Children, Tree, Component, BaseComponent, IntailOption } from "./type";
import { compTreeMap, filterElement } from './component-tree';
import { collectExportsData, recordCurrentComp } from "./instance";
import { triggerBeforeMount } from "./hooks/before-mount";
import { triggerMounted } from "./hooks/mounted";
import { triggerBeforeUnmount } from "./hooks/before-unmount";
import { triggerUnmounted } from "./hooks/unmounted";
import { Static } from "./create-html";

export class Element extends Static {

  constructor(option?: IntailOption) {
    super(option);
  }

  /**
   * 创建组件虚拟 DOM 树的函数
   * @param param0 
   * @returns 
   */
  render(tree: Tree): HTMLElement {
    const dom = this.createElement(tree);

    // 执行钩子函数
    triggerBeforeMount();
    nextTick(triggerMounted);

    return dom;
  }

  /**
   * 创建元素
   * @param tree 
   * @param 
   * @returns 
   */
  createElement(tree: Tree) {
    const { tag, attrs, children } = this.intercept(tree);

    // 节点
    if (isString(tag)) {
      return this.createRealNode(tag, attrs, children);
    }

    // 节点片段
    if (isFragment(tag)) {
      return this.createNodeFragment(children);
    }

    // 组件
    if (isComponent(tag)) {  
      return this.createComponent(tag, attrs, children);
    }
  }


  /**
   * 组件生成节点
   * @param tag 
   * @param attrs 
   * @param children 
   * @returns 
   */
  createComponent(tag: Component, attrs: Attrs, children: Children) {
    recordCurrentComp(tag);

    // 类组件
    if (isClassComponent(tag)) {
      // @ts-ignore
      const t = new tag({ ...attrs, children });
      tag = t.render.bind(t);
    }

    // 组件
    const props = objectAssign(attrs, { children });
    const tree = (tag as BaseComponent)(props);
    collectExportsData(tag, attrs);
    if (isAssignmentValueToNode(tree)) {  // 可能直接返回字符串数字
      return createTextNode(tree);
    }
    compTreeMap.set(tag, filterElement([tree, ...tree.children]));  // 收集组件
    return this.createElement(tree);
  }


  /**
   * 创建真实节点
   * @param tag 
   * @param attrs 
   * @param children 
   * @returns 
   */
  createRealNode(tag: string, attrs: AnyObj = {}, children: Children = ['']) {
    const el = document.createElement(tag as string);

    customForEach(children, val => {
      this.intercept(val);
      if (isFunction(val)) {
        const fragment = this.createNodeFragment([val]);
        appendChild(el, fragment);  // 响应式数据交给节点片段去处理
      } else {
        this.#nodeMount(el, val);
      }
    })

    // attrs 赋值
    for (const attr in attrs) {
      this.#attrAssign(el, attr, attrs[attr]);
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
  createNodeFragment(children: Children) {
    const fragment = document.createDocumentFragment();

    customForEach(children, val => {
      this.intercept(val);
      if (isFunction(val)) {
        this.#reactivityNode(fragment, val);  // 响应式数据挂载
      } else {
        this.#nodeMount(fragment, val);
      }
    })

    return fragment;
  }

  /**
   * 节点挂载
   * @param el 
   * @param val 
   */
  #nodeMount(el: HTMLElement | DocumentFragment, val: any) {
    if (noRenderValue(val)) return;

    // 节点片段
    if (isArray(val)) {
      const fragment = this.createNodeFragment(val);
      appendChild(el, fragment);
      return;
    }

    if (isAssignmentValueToNode(val) || isObject(val)) {
      const node = this.createNode(val as Tree);
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
  createNode(value: Tree | string) {
    // 文本节点
    if (isAssignmentValueToNode(value)) {
      return createTextNode(value);
    }

    // 节点
    if (isRealNode(value)) {
      return this.createRealNode(value.tag as string, value.attrs, value.children);
    }

    // 节点片段
    if (isFragment(value.tag)) {
      return this.createNodeFragment(value.children);
    }

    // 组件
    if (isComponent(value.tag)) {
      return this.createComponent(value.tag, value.attrs, value.children);
    }
  }

  /**
   * 属性赋值
   * @param el 
   * @param attr 
   * @param value 
   */
  #attrAssign(el: HTMLElement, attr: string, value: any) {
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
   * 响应式节点变化
   * @param fragment 
   * @param func 
   */
  #reactivityNode(fragment: DocumentFragment, func: () => any) {
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
          const node = this.createNode(val);
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
          const node = this.createNode(val);
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
          // @ts-ignore 节点片段无法删除
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

}

type BackupNode = {
  key:  number
  tree: Tree
  node: HTMLElement | DocumentFragment | Text
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
