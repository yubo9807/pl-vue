import { Component } from "../type";
import { Mount } from "./common";

const mount = new Mount();
/**
 * 注册一个 onBeforeMount 钩子
 * @param fn 
 */
export function onBeforeMount(fn: Function) {
  mount.append(fn);
}

/**
 * 执行所有 onBeforeMount 钩子
 */
export function triggerBeforeMount(comp: Component) {
  mount.run(comp);
}
