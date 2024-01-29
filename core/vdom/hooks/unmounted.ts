import { customForEach } from "../../utils";
import { getSubComponent } from "../../vdom/component-tree";
import { currentComp } from "../../vdom/instance";
import { Component } from "../../vdom/type";
import { hookLock } from "./utils";

const map = new WeakMap();

/**
 * 注册 onUnmounted 钩子
 * @param comp 组件名
 * @param fn 
 * @returns 
 */
export function onUnmounted(fn: Function) {
  if (hookLock) return;
  const arr = map.get(currentComp) || [];
  const isExist = arr.some(func => func === fn);
  if (isExist) return;

  arr.push(fn);
  map.set(currentComp, arr);
}

/**
 * 执行对应的 onUnmounted 钩子
 * @param comp 组件名
 */
export function triggerUnmounted(comp: Component) {
  const keys = getSubComponent(comp).map(val => val.comp);
  keys.unshift(comp);
  const funcs = [];
  customForEach(keys, key => {
    const arr = map.get(key) || [];
    funcs.push(...arr);
    map.delete(key);
  })
  customForEach(funcs, func => func());
}
