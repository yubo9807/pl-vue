import { printWarn } from "../utils/string";

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
  base = option.base || '/';
  if (!/(^\/$|^\/.+\/$)/.test(base)) {
    printWarn('base 必须以 / 开头 / 结尾');
  }
  mode = option.mode || 'history';
  isBrowser = option.isBrowser ?? true;
  ssrDataKey = option.SSR_DATA_KEY || 'g_initialProps';
}
