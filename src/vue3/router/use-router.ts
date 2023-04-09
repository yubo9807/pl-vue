import { formatPath, splicingUrl } from "./utils";
import { analysisRoute, currentRoute } from "./use-route";
import { base, Route, routes } from "./create-router";

const intailConfig = {
  name:  '',
  path:  '',
  query: {},
  hash:  '',
}

export type Config = {
  [prop in keyof typeof intailConfig]?: typeof intailConfig[prop]
}

/**
 * 向前 push 一个路由
 * @param option 
 */
function push(option: Config | string) {
  let path = '';
  if (typeof option === 'string') {
    path = formatPath(base + option);
  } else {
    path = splicingUrl(option);
  }
  history.pushState({}, null, path);
  analysisRoute(location.href);
}

/**
 * 替换当前路由
 * @param option 
 */
function replace(option: Config | string) {
  let path = '';
  if (typeof option === 'string') {
    path = formatPath(base + option);
  } else {
    path = splicingUrl(option);
  }
  history.replaceState({}, null, path);
  analysisRoute(location.href);
}

function go(num: number) {
  history.go(num);
  analysisRoute(location.href);
}

/**
 * 获取所有路由（扁平数组）
 * @returns 
 */
function getRoutes() {
  const newRoutes = [];

  function recursion(routes: Route[]) {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      newRoutes.push(route);
      if (route.children && route.children.length > 0) {
        recursion(route.children);
      }
    }
  }
  recursion(routes);

  return newRoutes;
}

export function useRouter() {
  return {
    currentRoute,
    getRoutes,
    go,
    forward: () => go(1),
    back: () => go(-1),
    options: {
      history: { base },
      routes,
    },
    push,
    replace,
  }
}