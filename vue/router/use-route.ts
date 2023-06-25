import { reactive } from '../reactivity/reactive';
import { base, isBrowser, mode } from './init-router';
import { getQueryAll } from './utils';

export const currentRoute = reactive({
  path:  '',
  query: {},
  hash:  '',
  meta:  {},
})

/**
 * 解析 url
 * @param url 
 */
export function analysisRoute(url: string) {
  const newUrl = new URL('http://0.0.0.0' + url);
  currentRoute.path = newUrl.pathname.replace(base, '');
  currentRoute.query = getQueryAll(newUrl.search);
  currentRoute.hash = newUrl.hash;
}

export function useRoute() {
  // 发生在 Router 组件渲染之前，并且是客户端
  if (!currentRoute.path && isBrowser) {
    let url = '';
    if (mode === 'history') {
      url = location.href.replace(location.origin + base, '');
    } else {
      url = location.hash.slice(1);
    }
    analysisRoute(url);
  }

  return currentRoute;
}