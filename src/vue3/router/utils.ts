import { base } from "./create-router";
import { Config } from "./use-router";

/**
 * 组织 url
 * @param option
 */
export function splicingUrl(option: Config) {
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

export function formatPath(url: string) {
  return url.replace(/\/+/g, '/');
}
