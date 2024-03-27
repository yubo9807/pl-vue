import { reactive } from "../reactivity";
import { isBrowser } from "../utils";
import { BeforeEnter, RouteOption } from "./type";
import { useRoute, useRouter } from "./use-router";
import { analyzeRoute } from "./utils";
import { App } from "../vdom";

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

export let currentApp: App = null;
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
export function createRouter(option: Config = {}) {
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
  } else {
    // 随便给个路径，防止报错。真正的路径在 ssrOutlet 赋值
    currentRoute = analyzeRoute('');
  }

  const router = useRouter();

  return {
    install(app: App) {
      currentApp = app;
      app.$router = router;
      app.$route = useRoute();
    },
    ...router,
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