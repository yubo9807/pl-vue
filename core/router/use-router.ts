import { toRaw } from "../reactivity";
import { isBrowser, isString } from "../utils"
import { config, currentRoute } from "./create-router"
import { BaseOption, SkipOption } from "./type";
import { analyzeRoute } from "./utils"

/**
 * 切换路由
 * @param option 
 * @param type 切换类型
 */
function toggle(option: SkipOption, type: 'push' | 'replace') {
  if (isString(option)) {
    if (config.mode === 'history') {
      option = config.base + option;
    }
    option = analyzeRoute(option as string);
  }
  for (const key in option as BaseOption) {
    currentRoute[key] = option[key];
  }
  const { fullPath } = currentRoute;

  if (!isBrowser()) return;
  if (config.mode === 'history') {
    history[type === 'push' ? 'pushState' : 'replaceState']({}, '', fullPath);
  } else {
    location.hash = fullPath;
  }
}

/**
 * 向前 push 一个路由
 * @param option 
 */
export function push(option: SkipOption) {
  toggle(option, 'push');
}

/**
 * 替换当前路由
 * @param option 
 */
export function replace(option: SkipOption) {
  toggle(option, 'replace');
}

/**
 * 向前/后改变路由
 * @param num 
 */
export function go(num: number) {
  history.go(num);
}

/**
 * router method
 * @returns 
 */
export function useRouter() {
  return {
    back: () => go(-1),
    forward: () => go(1),
    go,
    push,
    replace,
    options: config,
    currentRoute: toRaw(currentRoute),
  }
}

/**
 * 当前 route 信息
 * @returns 
 */
export function useRoute() {
  return currentRoute;
}
