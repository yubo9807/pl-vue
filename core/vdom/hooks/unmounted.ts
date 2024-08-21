import { CustomWeakMap, customForEach } from "../../utils";
import { getSubComponent } from "../../vdom/component-tree";
import { currentComp } from "../../vdom/instance";
import { Component } from "../../vdom/type";

const map = new CustomWeakMap();

/**
 * 注册 onUnmounted 钩子
 * @param comp 组件名
 * @param fn 
 * @returns 
 */
export function onUnmounted(fn: Function) {
  const arr = map.get(currentComp) || [];
  const isExist = arr.some(func => func === fn);
  if (isExist) return;

  arr.push(fn);
  map.set(currentComp, arr);
}

/**
 * 执行对应的 onUnmounted 钩子
 * @param comp 组件名
 * @param itemFunc 卸载每个组件时其他操作
 */
export function triggerUnmounted(comp: Component, itemFunc: (comp: Component) => void) {
  const keys = getSubComponent(comp).map(val => val.comp);
  keys.unshift(comp);
  const funcs = [];
  customForEach(keys.reverse(), key => {
    itemFunc(key);
    const arr = map.get(key) || [];
    funcs.push(...arr);
    map.delete(key);
  })
  customForEach(funcs, func => func());
}
