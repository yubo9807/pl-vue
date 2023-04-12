import { Config, formatPath, splicingUrl } from './utils';
import { base, mode } from './init-router';
import { analysisRoute } from './use-route';

/**
 * 向前 push 一个路由
 * @param option 
 */
function push(option: Config | string) {
  let path = '';
  if (typeof option === 'string') {
    path = mode === 'history' ? formatPath(base + option) : option;
  } else {
    path = splicingUrl(option);
  }

  if (mode === 'history') {
    history.pushState({}, '', path);
  } else {
    location.hash = path;
  }
  analysisRoute(location.href);
}

/**
 * 替换当前路由
 * @param option 
 */
function replace(option: Config | string) {
  let path = '';
  if (typeof option === 'string') {
    path = mode === 'history' ? formatPath(base + option) : option;
  } else {
    path = splicingUrl(option);
  }

  if (mode === 'history') {
    history.pushState({}, '', path);
  } else {
    location.hash = path;
  }
  analysisRoute(location.href);
}

function go(num: number) {
  history.go(num);
  analysisRoute(location.href);
}

export function useRouter() {
  return {
    push,
    replace,
    go,
  }
}