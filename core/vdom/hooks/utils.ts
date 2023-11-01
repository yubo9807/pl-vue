import { isObject, objectAssign } from "../../utils";
import { getComponentId } from "../../vdom/h";
import { Tree } from "../../vdom/type";
import { isComponent } from "../../vdom/utils";

/**
 * 当上锁时，所有的钩子都将无法注册
 */
export let hookLock = false;

/**
 * 设置锁开关
 * @param bool 
 */
export function setLock(bool: boolean) {
  hookLock = bool;
}

/**
 * 执行子组件钩子
 * @param comp 
 * @param triggerHook 
 */
export function collectCompId(tree: Tree) {
  hookLock = true;

  const collect = [];

  function recursion(tree) {
    if (!isObject(tree)) return;

    const { tag, attrs, children } = tree;
    const props = objectAssign(attrs, { children });
    if (isComponent(tag)) {
      collect.push(getComponentId(tag));
      const newTree = tag(props);
      recursion(newTree);
    } else {
      children.forEach(val => {
        recursion(val);
      })
    }
  }
  recursion(tree);

  hookLock = false;

  return collect;
}
