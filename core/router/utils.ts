import { BaseOption, RouteOption } from "./type";

/**
 * 获取 url query
 * @param url 
 * @returns 
 */
export function parseQuery(url: string) {
	const query = {};
	url.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => (query[k] = v));
	return query;
}

/**
 * 根据 url 解析 route
 * @param url 
 * @returns 
 */
export function analyzeRoute(url: string): RouteOption {
  const newUrl = new URL('http://0.0.0.0' + url);
  return {
    fullPath: newUrl.href.replace(newUrl.origin, ''),
    path:     newUrl.pathname,
    query:    parseQuery(newUrl.search),
    hash:     newUrl.hash,
  }
}

/**
 * 组织 url
 * @param option 
 * @returns 
 */
export function splicingUrl(option: BaseOption) {
  let search = '';
  for (const key in option.query) {
    if (option.query[key]) {
      search += `${key}=${option.query[key]}&`;
    }
  }
  search = search ? '?' + search.slice(0, -1) : '';
  let hash = option.hash ? '#' + option.hash : '';
  return option.path + search + hash;
}

/**
 * 格式化 url，删除重复的 /
 * @param url 
 * @returns 
 */
export function formatUrl(url: string) {
  return url.replace(/\/{1,}/g, '/');
}
