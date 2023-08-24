import { reactive, toRaw } from '../reactivity/reactive';
import { isBrowser } from '../utils/judge';
import { Component } from '../vdom/type';
import { push, replace, go } from './use-router';
import { RouteOption, analyzeRoute } from './utils';

type Config = {
  base: string
  mode: 'history' | 'hash'
  ssrDataKey: string
  routes: {
    path?: string
    component: Component
    exact?: boolean
    redirect?: string
  }[]
}
export const config: Config = {
  base: '',
  mode: 'history',
  ssrDataKey: 'g_initialProps',
  routes: [],
}

export let currentRoute: RouteOption = null;

type Option = {
  [k in keyof Config]?: Config[k]
}
export function createRouter(option: Option = {}) {
  Object.assign(config, option);

  // 浏览器环境
  if (isBrowser()) {
    const route = analyzeRoute(getBrowserUrl());
    currentRoute = reactive(route);
  } else {
    // 服务端只需初始化，真正解析由 StaticRouter 组件来完成
    // 并且服务端也不需要响应式数据
    currentRoute ??= analyzeRoute('/');
  }

  return {
    back: () => go(-1),
    forward: () => go(1),
    go,
    push,
    replace,
    options: config,
    currentRoute: toRaw(currentRoute),
  }
}

/**
 * route 发生变化，响应式数据重新赋值
 * @param url 
 */
export function routeChange(url: string) {
  const option = analyzeRoute(url);
  for (const key in option) {
    currentRoute[key] = option[key];
  }
}

/**
 * 获取浏览器端 url
 */
export function getBrowserUrl() {
  if (config.mode === 'history') {
    return location.href.replace(location.origin + config.base, '');
  } else {
    return location.hash.slice(1);
  }
}

/**
 * 查找匹配的路由信息
 * @param path 
 * @returns 
 */
export function findRoute(path: string) {
  const route = config.routes.find(val => {
    if (val.exact || val.exact === void 0) {
      return path === val.path;
    } else {
      return (path + '/').startsWith(val.path + '/');
    }
  });
  return route;
}

/**
 * 获取当前的路有信息
 * @returns 
 */
export function useRoute() {
  return currentRoute;
}
