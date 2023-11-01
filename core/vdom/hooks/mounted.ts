import { nextTick } from "../../utils";
import { hookLock } from "./utils";

const collect = [];

let isMounted = false;

/**
 * 注册一个 onMounted 钩子
 * @param fn 
 */
export function onMounted(fn: Function) {
  if (hookLock) return;
  if (isMounted) {
    nextTick(fn);
    return;
  }
  collect.push(fn);
}

/**
 * 执行所有 onMounted 钩子
 */
export function triggerMounted() {
  collect.forEach(fn => {
    fn();
  })
  collect.length = 0;
  isMounted = true;
}
