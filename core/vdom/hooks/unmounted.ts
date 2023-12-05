import { getSubComponent } from "../../vdom/component-tree";
import { getComponentId } from "../../vdom/h";
import { currentComp } from "../../vdom/instance";
import { Component } from "../../vdom/type";
import { hookLock } from "./utils";

const map = new Map();

/**
 * 注册 onUnmounted 钩子
 * @param comp 组件名
 * @param fn 
 * @returns 
 */
export function onUnmounted(fn: Function) {
  if (hookLock) return;
  const key = getComponentId(currentComp);  // 在微队列之前与微队列之后拿到的 id 不一致
  const arr = map.get(key) || [];
  const isExist = arr.some(func => func === fn);
  if (isExist) return;

  arr.push(fn);
  map.set(key, arr);
}

/**
 * 执行对应的 onUnmounted 钩子
 * @param comp 组件名
 */
export function triggerUnmounted(comp: Component) {
  const keys = getSubComponent(comp).map(val => val.compId);
  keys.unshift(getComponentId(comp));
  const funcs = [];
  keys.forEach(key => {
    const arr = map.get(key) || [];
    funcs.push(...arr);
    map.delete(key);
  })
  funcs.forEach(func => {
    func();
  })
}