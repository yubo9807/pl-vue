import { AnyObj, CustomWeakMap } from "../utils";
import { currentComp } from "./instance";
import { Component } from "./type";

export const contextMap: WeakMap<Component, AnyObj> = new CustomWeakMap();

/**
 * 创建上下文，储存数据
 * @param initial 初始数据，不会因组件的卸载而消失
 * @returns 
 */
export function createContext<T extends AnyObj>(initial: T) {

  // 数据收集
  const set: Set<Component> = new Set();

  /**
   * 提供额外数据，组件数据
   * @param value 
   */
  function provide(value: Partial<T>) {
    if (!currentComp) return;
    contextMap.set(currentComp, value);
    set.add(currentComp);
  }

  /**
   * 获取当前上下文数据
   * @returns 
   */
  function inject(): T {
    const collect: AnyObj = { ...initial };

    set.forEach(comp => {
      const data = contextMap.get(comp);
      if (!data) {
        set.delete(comp);  // 未找到数据，说明组件已被卸载
        return;
      }
      for (const key in data) {
        collect[key] = data[key];
      }
    })

    return collect as T;
  }

  /**
   * 销毁
   */
  function destroy() {
    set.forEach(comp => {
      set.delete(comp);
      contextMap.delete(comp);
    })
    initial = {} as T;
  }

  return {
    provide,
    inject,
    destroy,
  }
}