type Mode = 'history' | 'hash'

export let base = '/';
export let mode: Mode = 'history';
export let isBrowser = true;


type Option = {
  base:       string
  mode?:      Mode
  isBrowser?: boolean
}
/**
 * 创建路由
 * @param option 
 */
export function initRouter(option: Option) {
  base = option.base;
  mode = option.mode;
  isBrowser = option.isBrowser;
}
