import { Config, formatPath, splicingUrl } from './utils';
import { base, mode } from './init-router';
import { analysisRoute, currentRoute } from './use-route';

/**
 * 向前 push 一个路由
 * @param option 
 */
function push(option: Config | string) {
  const path = typeof option === 'string' ? option : splicingUrl(option);

  if (mode === 'history') {
    history.pushState({}, '', formatPath(base + '/' + path));
  } else {
    location.hash = path;
  }
  analysisRoute(path);
}

/**
 * 替换当前路由
 * @param option 
 */
function replace(option: Config | string) {
  const path = typeof option === 'string' ? option : splicingUrl(option);

  if (mode === 'history') {
    history.replaceState({}, '', formatPath(base + '/' + path));
  } else {
    location.hash = path;
  }
  analysisRoute(path);
}

function go(num: number) {
  history.go(num);
}

export function useRouter() {
  return {
    push,
    replace,
    go,
  }
}