import { reactive, toRaw } from '../reactivity/reactive';
import { nextTick } from '../utils/next-tick';
import { isBrowser } from '../utils/judge';
import { deepClone } from '../utils/object';
import { Component } from '../vdom/type';
import { push, replace, go } from './use-router';
import { RouteOption, analyzeRoute, getBrowserUrl } from './utils';
import { ref } from '../reactivity';

type Config = {
  base: string
  mode: 'history' | 'hash'
  ssrDataKey: string
  routes: {
    path?: string
    component: Component
    exact?: boolean
    redirect?: string
  }[],
}
export const config: Config = {
  base: '',
  mode: 'history',
  ssrDataKey: 'g_initialProps',
  routes: [],
}

export let currentRoute: RouteOption = null;
export const isReady = ref(false);

type Option = {
  [k in keyof Config]?: Config[k]
}
export function createRouter(option: Option = {}) {
  Object.assign(config, option);

  // 浏览器环境
  if (isBrowser()) {
    const route = analyzeRoute(getBrowserUrl());
    currentRoute = reactive(route);
    nextTick(() => {
      beforeEach(route, route, () => {
        isReady.value = true;
      });
    });
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
    beforeEach(func: typeof beforeEach) {
      beforeEach = func;
    },
  }
}

let beforeEach = (from: RouteOption, to: RouteOption, next: Function) => {
  next();
}

/**
 * route 发生变化，响应式数据重新赋值
 * @param url 
 */
export function routeChange(url: string) {
  const from = deepClone(currentRoute);
  const to = analyzeRoute(url);
  return new Promise((resolve, reject) => {
    beforeEach(from, to, () => {
      for (const key in to) {
        currentRoute[key] = to[key];
      }
      resolve(1);
    })
  })
}

/**
 * 获取当前的路有信息
 * @returns 
 */
export function useRoute() {
  return currentRoute;
}
