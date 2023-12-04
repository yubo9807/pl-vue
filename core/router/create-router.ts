import { reactive } from "../reactivity";
import { isBrowser } from "../utils";
import { RouteOption } from "./type";
import { analyzeRoute } from "./utils";

type Config = {
  base?:       string
  mode?:       'history' | 'hash'
  ssrDataKey?: string
}

export const config: Config = {
  base:       '',
  mode:       'history',
  ssrDataKey: 'g_initialProps',
}

export let currentRoute: RouteOption = null;
export function setCurrentRoute(route: RouteOption) {
  currentRoute = route;
}

/**
 * 获取浏览器 url
 * @returns 
 */
function getBrowserUrl() {
  const { origin, href, hash } = location;
  if (config.mode === 'hash') {
    return hash.replace('#', '');
  }
  return href.replace(origin + config.base, '');
}

export function initRouter(option: Config) {
  Object.assign(config, option);
  if (isBrowser()) {
    const route = analyzeRoute(getBrowserUrl());
    currentRoute = reactive(route);
    window.addEventListener('popstate', () => {
      const route = analyzeRoute(getBrowserUrl());
      for (const key in route) {
        currentRoute[key] = route[key];
      }
    })
  }
}

export function useRoute() {
  return currentRoute;
}

// 服务端临时变量
export const variable = {
  currentTemplate: '',
  ssrData:         {},
}