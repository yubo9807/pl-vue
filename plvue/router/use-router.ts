import { RouteOptionOptional, splicingUrl } from './utils';
import { config, routeChange } from './use-route';

/**
 * 向前 push 一个路由
 * @param option 
 */
export function push(option: RouteOptionOptional | string) {
  const path = splicingUrl(option);

  if (config.mode === 'history') {
    history.pushState({}, '', config.base + path);
  } else {
    location.hash = path;
  }
  routeChange(path);
}

/**
 * 替换当前路由
 * @param option 
 */
export function replace(option: RouteOptionOptional | string) {
  const path = splicingUrl(option);

  if (config.mode === 'history') {
    history.replaceState({}, '', config.base + path);
  } else {
    location.hash = path;
  }
  routeChange(path);
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