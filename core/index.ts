export * from './reactivity';
export { nextTick } from './utils/next-tick';
export { h, Fragment } from "./vdom/h";
export { defineExpose, getCurrentInstance } from './vdom/instance';
export { render, renderToString } from "./vdom/render";
export * from './hooks';
export * from './store';
export * from './router';

import { AnyObj } from './utils/type';
import { Children } from './vdom/type';
export type PropsType<T extends AnyObj> = T & {
  ref?:      any
  children?: Children
}
