import { RouteOptionOptional, splicingUrl } from './utils';
import { config, routeChange } from './create-router';

/**
 * 切换路由
 * @param option 
 * @param type 切换类型
 */
export function toggle(option: RouteOptionOptional | string, type: 'push' | 'replace') {
  const path = splicingUrl(option);
  
  routeChange(path).then(() => {
    if (config.mode === 'history') {
      history[type === 'push' ? 'pushState' : 'replaceState']({}, '', config.base + path);
    } else {
      location.hash = path;
    }
  });
}

/**
 * 向前 push 一个路由
 * @param option 
 */
export function push(option: RouteOptionOptional | string) {
  toggle(option, 'push');
}

/**
 * 替换当前路由
 * @param option 
 */
export function replace(option: RouteOptionOptional | string) {
  toggle(option, 'replace');
}

export function go(num: number) {
  history.go(num);
}

export function useRouter() {
  return {
    push,
    replace,
    go,
  }
}