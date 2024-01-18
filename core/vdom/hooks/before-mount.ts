import { customForEach } from "../../utils";
import { hookLock } from "./utils";

const collect = [];

let isBeforeMount = false;

/**
 * 注册一个 onBeforeMount 钩子
 * @param fn 
 */
export function onBeforeMount(fn: Function) {
  if (hookLock) return;
  if (isBeforeMount) {
    fn();
    return;
  }
  collect.push(fn);
}

/**
 * 执行所有 onBeforeMount 钩子
 */
export function triggerBeforeMount() {
  customForEach(collect, fn => fn());
  collect.length = 0;
  isBeforeMount = true;
}
