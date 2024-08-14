import { nextTick } from "~/core/utils";
import { Component } from "../type";
import { Mount } from "./common";

const mount = new Mount();
/**
 * 注册一个 onMounted 钩子
 * @param fn 
 */
export function onMounted(fn: Function) {
  mount.append(fn);
}

/**
 * 执行所有 onMounted 钩子
 */
export function triggerMounted(comp: Component) {
  nextTick(() => {
    mount.run(comp);
  })
}
