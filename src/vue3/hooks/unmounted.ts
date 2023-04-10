import { Tree } from "../vdom/type";
import { hookLock, collectCompId } from "./utils";

const map = new Map();

/**
 * 注册 onUnmounted 钩子
 * @param comp 组件名
 * @param fn 
 * @returns 
 */
export function onUnmounted(comp: Function, fn: Function) {
  if (hookLock) return;
  const key = comp.prototype._id;  // 在微队列之前与微队列之后拿到的 id 不一致
  const arr = map.get(key) || [];
  const isExist = arr.some(func => func === fn);
  if (isExist) return;

  arr.push(fn);
  map.set(key, arr);
}

/**
 * 执行对应的 onUnmounted 钩子
 * @param comp 组件名
 */
export function triggerUnmounted(tree: Tree) {
  const comps = collectCompId(tree);
  comps.forEach(key => {
    const funcs = map.get(key) || [];
    if (funcs.length === 0) return;

    funcs.forEach(func => func());
    map.delete(key);
  })
}
