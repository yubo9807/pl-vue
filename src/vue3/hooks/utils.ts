import { isType } from "../utils/judge";
import { isComponent } from "../vdom/utils";

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
export function triggerSubCompHook(comp: Function, triggerHook: Function) {
  hookLock = true;
  const tree = comp();
  if (tree && isType(tree) === 'object') {
    tree.children.forEach(val => {
      if (isComponent(val.tag)) {
        triggerHook(val.tag);
      }
    })
  }
  hookLock = false;
}
