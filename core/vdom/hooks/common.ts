
import { customForEach, CustomWeakMap } from "../../utils";
import { currentComp } from "../instance";
import { Component } from "../type";

export class Mount {
  #map: WeakMap<Component, Function[]> = new CustomWeakMap();
  constructor() {}

  /**
   * 添加钩子
   * @param fn 
   * @returns 
   */
  append(fn: Function) {
    const funcs = this.#map.get(currentComp) || [];
    const isExist = funcs.some(f => f === fn);
    if (isExist) return;
    funcs.push(fn);
    this.#map.set(currentComp, funcs);
  }

  /**
   * 执行搜集的钩子
   * @param comp 
   */
  run(comp: Component) {
    const funcs = this.#map.get(comp) || [];
    customForEach(funcs, fn => fn());
    this.#map.delete(comp);
  }
}
