import { isString } from "../utils/judge";

export type RouteOption = ReturnType<typeof analyzeRoute>

/**
 * 根据 url 解析 route
 * @param url 
 * @returns 
 */
export function analyzeRoute(url: string) {
  const newUrl = new URL('http://0.0.0.0' + url);
  return {
    path: newUrl.pathname,
    query: getQueryAll(newUrl.search),
    hash: newUrl.hash,
  }
}

/**
 * 组织 url
 * @param option
 */
export function splicingUrl(option: RouteOption | string): string {
  if (isString(option)) return option as string;

  option = option as RouteOption
  const pathname = option.path;
  let queryStr = '';
  for (const key in option.query) {
    queryStr += `&${key}=${option.query[key]}`;
  }
  queryStr = queryStr ? '?' + queryStr : '';
  const hash = option.hash ? '#' + option.hash : '';

  const url = pathname + queryStr + hash;
  return url;
}

/**
 * 获取路由 query
 * @param search 
 * @returns 
 */
export function getQueryAll(search: string) {
  const obj = {};
  const arr = search.replace('?', '').split('&');
  arr.forEach(val => {
    const [ key, value ] = val.split('=');
    if (key && value) obj[key] = value;
  })
  return obj;
}

/**
 * 格式化路径，将多余的 / 删除掉
 * @param url 
 * @returns 
 */
export function formatPath(url: string) {
  return url.replace(/\/+/g, '/');
}
