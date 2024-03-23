import { Component } from "./type";

const globalComp = new Map<string, Component>();

/**
 * 获取全局组件
 * @param name 
 * @returns 
 */
export function getGlobalComponent(name: string) {
  return globalComp.get(name);
}

/**
 * 注册全局组件
 * @param name 
 * @param Comp 
 */
export function useGlobalComponent(name: string, Comp: Component) {
  globalComp.set(name, Comp);
}
