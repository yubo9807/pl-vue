import { reactive } from "../reactivity";
import { isBrowser } from "../utils";
import { BeforeEnter, RouteOption } from "./type";
import { useRouter } from "./use-router";
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

export let beforeEach: BeforeEnter = null;

/**
 * 初始化路由
 * @param option 
 * @returns 
 */
export function initRouter(option: Config = {}) {
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

  return {
    ...useRouter(),
    beforeEach(func: BeforeEnter) {
      beforeEach = func;
    },
  }
}

// 服务端临时变量
export const variable = {
  currentTemplate: '',
  ssrData:         {},
}