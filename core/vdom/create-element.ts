import { AnyObj, isFunction, isObject, isString, customForEach, isArray, printWarn, len, isEquals, isStrictObject, binarySearch, customFindIndex, cloneFunction, objectAssign, isClass, throwError } from '../utils';
import { isAssignmentValueToNode, isComponent, createTextNode, appendChild, isRealNode, noRenderValue, joinClass, isReactiveChangeAttr } from "./utils"
import { isFragment } from "./h";
import { appendComponentTree, collectComponentTree, removeComponentTree } from './component-tree';
import { collectExportsData, recordCurrentComp } from "./instance";
import { triggerMounted } from "./hooks/mounted";
import { triggerBeforeUnmount } from "./hooks/before-unmount";
import { triggerUnmounted } from "./hooks/unmounted";
import { Static, StaticOption } from "./create-html";
import type { Attrs, Children, Tree, Component, BaseComponent } from "./type";
import type { effectScope } from '../reactivity';
import { contextMap } from './context';
import { KeepAlive } from './keep-alive';
import { triggerBeforeMount } from './hooks/before-mount';
import { compSoleSet } from './hooks/common';

export interface StructureOption extends StaticOption {
  binding:     Function
  effectScope: typeof effectScope
}

export class Structure extends Static {

  #binding:     Function  // 响应式函数
  #effectScope: typeof effectScope

  constructor(option: StructureOption) {
    super();
    this.#binding     = option.binding;
    this.#effectScope = option.effectScope;
  }

  /**
   * 创建组件虚拟 DOM 树的函数
   * @param param0 
   * @returns 
   */
  render(tree: Tree): HTMLElement {
    return this.createElement(tree);
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
      return this.createComponent(tree);
    }
  }

  #keepAlive = new KeepAlive();
  /**
   * 组件缓存属性判断
   * @param attrs 
   * @returns 
   */
  #hasKeepAlive(attrs: Attrs) {
    const { keepAlive } = attrs;
    return isStrictObject(keepAlive) ? keepAlive.enable : keepAlive;
  }

  /**
   * 组件生成节点
   * @param tag 
   * @param attrs 
   * @param children 
   * @returns 
   */
  createComponent(tree) {
    const { tag, attrs, children } = tree;
    tag.prototype.$effect ??= this.#effectScope();  // 添加侦听器执行域

    const { $clone, $effect } = tag.prototype;

    if ($clone || compSoleSet.has(tag)) {
      tree.tag = cloneFunction(tag, true);
    }

    // 原始组件对象
    const originComp = tree.tag;

    // 缓存组件
    if (this.#hasKeepAlive(attrs)) {
      const node = this.#keepAlive.get(originComp);
      if (node) return node;
    } else {
      this.#keepAlive.del(originComp);
    }

    recordCurrentComp(originComp);
    const props = { ...attrs, children }

    // 类组件
    let comp = originComp as BaseComponent;
    if (isClass(comp)) {
      // @ts-ignore
      const t = new comp(props);
      if (!isFunction(t.render)) {
        throwError(`Class component must have 'render' method`);
      }
      comp = t.render.bind(t);
    }

    // 组件
    const newTree = $effect ? $effect.run(() => comp(props)) : comp(props);

    collectExportsData(comp, attrs);          // 组件导出数据

    if (isAssignmentValueToNode(newTree)) {
      return createTextNode(newTree);
    }

    collectComponentTree(comp, newTree);      // 收集组件树

    triggerBeforeMount(comp);                 // 挂载前钩子
    const node = this.createElement(newTree);
    triggerMounted(comp);                     // 挂载后钩子

    if (this.#hasKeepAlive(attrs)) {
      this.#keepAlive.set(originComp, node);  // 设置缓存组件
    }

    return node;
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

    // created 和 children 中同时具备相同的值，删掉 children 中的值
    const created = attrs.created;
    if (isFunction(created)) {
      const index = customFindIndex(children, val => val === created);
      index >= 0 && children.splice(index, 1);
    }

    customForEach(children, tree => {
      const val = this.intercept(tree);
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
    if (attrs.style && isStrictObject(attrs.style)) {
      for (const prop in attrs.style) {
        const value = attrs.style[prop];
        if (isFunction(value)) {
          this.#binding(() => el.style.setProperty(prop, value()));
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

    customForEach(children, tree => {
      const val = this.intercept(tree);
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

    if (isAssignmentValueToNode(val) || isStrictObject(val)) {
      const node = this.#createNode(val as Tree);
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
  #createNode(value: Tree | string) {
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
      return this.createComponent(value);
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
    if (attr === 'ref' && isStrictObject(value)) {
      value.value = el;
      return;
    }
    if (attr === 'created' && isFunction(value)) {
      value(el);
      return;
    }
    if (attr === 'className' && isArray(value)) {
      this.#binding(() => {
        el[attr] = joinClass(...value);
      })
      return;
    }

    // 一般属性赋值
    let assgin = (val: string) => el[attr] = val;

    // 特殊属性处理
    if (attr === 'className') {
      assgin = (val: string) => el[attr] = joinClass(val);
    } else if (attr.startsWith('data-')) {
      assgin = (val: string) => el.dataset[attr.slice(5)] = val;
    }

    // 响应式数据
    if (isReactiveChangeAttr(attr) && isFunction(value)) {
      this.#binding(() => assgin(value()));
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
    type BackupNode = {
      key:  number
      tree: Tree
      node: HTMLElement | DocumentFragment | Text
    }
    let backupNodes: BackupNode[] = [];
    let lockFirstRun = true;  // 锁：第一次运行
    let parent = null;

    const textNode = createTextNode('');  // 用于记录添加位置
    appendChild(fragment, textNode);

    this.#binding(() => {
      let value = func();
      if (value && isObject(value) && isFragment(value.tag)) {
        printWarn('不支持响应式节点片段渲染');
        return;
      }

      if (!isArray(value)) value = [value];
      value = value.filter(val => !noRenderValue(val));
      appendComponentTree(func, value);

      let i = 0;
      while (i < len(value)) {
        let val = value[i];

        const index = binarySearch(backupNodes, i, v => v.key);
        if (index >= 0) {  // 节点已经存在
          const backup = backupNodes[index];
          if (isEquals(val, backup.tree)) {  // 任何数据都没有变化
            i++;
            continue;
          }

          // 节点替换，重新备份
          const node = this.#createNode(val);
          if (!node) {  // 创建节点失败，有可能原节点被删除
            value.splice(index, 1);
            i++;
            continue;
          }

          const backupTree = backup.tree, backupNode = backup.node;
          const backupComp = backupTree.tag as Component;

          const replaceNode = () => backupNode.parentElement.replaceChild(node, backupNode);

          if (isComponent(backupComp)) {
            if (this.#hasKeepAlive(backupTree.attrs)) {
              replaceNode();
            } else {
              this.#beforeUnload(backupComp);  // 组件卸载之前
              replaceNode();
              this.#afterUnload(backupComp);   // 组件卸载之后
            }
          } else {
            replaceNode();
          }

          backup.tree = val;
          backup.node = node;
        } else {  // 节点不存在，追加节点
          const node = this.#createNode(val);
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
          const backup = backupNodes[i];
          const backupTree = backup.tree;
          const backupComp = backupTree.tag as Component;

          const nodeRemove = () => (backup.node as HTMLElement).remove();
          if (isComponent(backupComp)) {
            if (this.#hasKeepAlive(backupTree.attrs)) {
              nodeRemove();
            } else {
              this.#beforeUnload(backupComp);  // 组件卸载之前
              nodeRemove();
              this.#afterUnload(backupComp);   // 组件卸载之后
            }
          } else {
            nodeRemove();
          }
        }
        backupNodes.splice(len(value), len(backupNodes) - len(value));
      }

      lockFirstRun = false;
    })
  }

  /**
   * 卸载之前
   */
  #beforeUnload(comp: Component) {
    triggerBeforeUnmount(comp);
  }

  /**
   * 卸载之后
   * @param comp 
   * @returns 
   */
  #afterUnload(comp: Component) {
    contextMap.delete(comp);
    triggerUnmounted(comp, val => {
      this.#keepAlive.del(val);
      const { $effect } = val.prototype;
      $effect && $effect.stop();
    });
    removeComponentTree(comp);
  }

}
