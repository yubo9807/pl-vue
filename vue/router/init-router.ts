type Mode = 'history' | 'hash'

export let base = '';
export let mode: Mode;
export let isBrowser = true;
export let ssrDataKey = '';


type Option = {
  base:          string
  mode?:         Mode
  isBrowser?:    boolean
  SSR_DATA_KEY?: string
}
/**
 * 创建路由
 * @param option 
 */
export function initRouter(option: Option) {
  base = option.base || '';
  mode = option.mode || 'history';
  isBrowser = option.isBrowser ?? true;
  ssrDataKey = option.SSR_DATA_KEY || 'g_initialProps';
}
