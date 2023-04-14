import { reactive } from '../reactivity/reactive';
import { base } from './init-router';
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
  return currentRoute;
}