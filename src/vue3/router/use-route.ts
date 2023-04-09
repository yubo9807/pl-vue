import { reactive } from "../reactivity/reactive"
import { base, Route, routes } from "./create-router";
import { getQueryAll } from "./utils";

/**
 * 当前路由
 */
export const currentRoute = reactive({
  fullPath: '',
  hash:     '',
  matched:  [],
  meta:     {},
  name:     '',
  query:    {},
  path:     '',
});

/**
 * 获取当前路由信息
 * @returns 
 */
export function useRoute() {
  return currentRoute;
}

/**
 * 解析 url
 * @param url 
 */
export function analysisRoute(url: string) {
  const newUrl = new URL(url);
  currentRoute.path = newUrl.pathname.replace(base, '');
  currentRoute.query = getQueryAll(newUrl.search);
  currentRoute.hash = newUrl.hash.replace('#', '');
  currentRoute.fullPath = currentRoute.path + newUrl.search + newUrl.hash;
  currentRoute.meta = history.state || {};
  currentRoute.matched = getMatched(currentRoute.path);
}

/**
 * 获取嵌套路由项
 * @param path 
 * @param collect 
 * @returns 
 */
function getMatched(path: string) {
  const collect: Route[] = [];

  function recursion(routes: Route[]) {
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i];

      if (path.startsWith(item.path)) {
        collect.push(item);
        if (path === item.path) break;
        if (item.children && item.children.length > 0) {
          recursion(item.children);
        }
      } else {
        continue;
      }
    }
  }
  recursion(routes);

  return collect.reverse();

}