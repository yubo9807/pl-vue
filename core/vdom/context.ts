import { AnyObj, CustomWeakMap } from "../utils";
import { getSubComponent } from "./component-tree";
import { currentComp } from "./instance";
import { Component } from "./type";

export const contextMap: WeakMap<Component, AnyObj> = new CustomWeakMap();

/**
 * 创建上下文，储存数据
 * @param initial 初始数据，不会因组件的卸载而消失
 * @returns 
 */
export function createContext<T extends AnyObj>(initial = {} as T) {

  // 数据收集
  const set: Set<Component> = new Set();
  /**
   * 提供额外数据，组件数据
   * @param value 
   */
  function provide(value: Partial<T>) {
    if (!currentComp) thorwError('provide');
    contextMap.set(currentComp, value);
    set.add(currentComp);
  }

  /**
   * 获取当前上下文数据
   * @returns 
   */
  function inject(): T {
    if (!currentComp) thorwError('inject');
    const collect: AnyObj = { ...initial };

    set.forEach(comp => {
      // 检查是否为 provide 添加数据时组件的子组件。保证单项数据流
      const child = getSubComponent(comp);
      const index = child.findIndex(c => c.comp === currentComp);
      if (index < 0) {
        remove(comp);  // 将添加的数据移除
        return;
      }

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
   * 删除某个组件提供的数据
   * @param comp 
   */
  function remove(comp: Component) {
    set.delete(comp);
    contextMap.delete(comp);
  } 

  /**
   * 销毁
   * @param delInintial 是否删除初始数据
   */
  function destroy(delInintial?: boolean) {
    set.forEach(remove);
    if (delInintial) initial = {} as T;
  }

  return {
    provide,
    inject,
    destroy,
  }
}

function thorwError(name: string) {
  throw new Error(`${name} unable to get the current component`);
}