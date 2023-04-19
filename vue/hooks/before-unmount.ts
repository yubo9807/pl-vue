import { getSubComponent } from "../vdom/component-tree";
import { Component } from "../vdom/type";
import { hookLock } from "./utils";

const map = new Map();

/**
 * 注册 onBeforeUnmount 钩子
 * @param comp 组件名
 * @param fn 
 * @returns 
 */
export function onBeforeUnmount(comp: Component, fn: Function) {
  if (hookLock) return;
  const key = comp.prototype._id;
  const arr = map.get(key) || [];
  const isExist = arr.some(func => func === fn);
  if (isExist) return;

  arr.push(fn);
  map.set(key, arr);
}

/**
 * 执行对应的 onBeforeUnmount 钩子
 * @param comp 组件名
 */
export function triggerBeforeUnmount(comp: Component) {
  const keys = getSubComponent(comp).map(val => val.compId);
  keys.unshift(comp.prototype._id);
  const funcs = [];
  keys.forEach(key => {
    const arr = map.get(key) || [];
    funcs.push(...arr);
  })
  funcs.forEach(func => {
    func();
  })
}
