import { nextTick } from "../utils/next-tick";

const collect = [];

let isMounted = false;

/**
 * 创建一个 mounted 钩子
 * @param fn 
 */
export function onMounted(fn: Function) {
  if (isMounted) {
    nextTick(fn);
    return;
  }
  collect.push(fn);
}

/**
 * 执行所有 mounted 钩子
 */
export function triggerMounted() {
  collect.forEach(fn => {
    fn();
  })
  collect.length = 0;
  isMounted = true;
}
