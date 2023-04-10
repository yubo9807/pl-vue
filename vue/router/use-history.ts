import { reactive } from "../reactivity/reactive";
import { Config, formatPath, getQueryAll, splicingUrl } from "./utils";

export const base = '/dist';

export type Mode = 'history' | 'hash'
let mode: Mode = 'history';
export function setMode(type: Mode) {
  mode = type;
}

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
  const newUrl = new URL(url);
  currentRoute.path = newUrl.pathname;
  currentRoute.query = getQueryAll(newUrl.search);
  currentRoute.hash = newUrl.hash;
}

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
    history.pushState({}, null, path);
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
    history.pushState({}, null, path);
  } else {
    location.hash = path;
  }
  analysisRoute(location.href);
}

function go(num: number) {
  history.go(num);
  analysisRoute(location.href);
}

export function useHistory() {
  return {
    mode,
    currentRoute,
    push,
    replace,
    go,
  }
}