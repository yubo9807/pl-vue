import { Component } from "./type";
import { Structure, StructureOption } from "./create-element"; 
import { isString } from "../utils";
import { binding } from "../reactivity";

type Plugin = {
  install: (app: App) => void;
}
export class App extends Structure {

  [k: string]: any

  constructor(option: StructureOption) {
    super(option);
    this.option = option;
  }

  use(plugin: Plugin) {
    plugin.install(this);
    return this;
  }

  version = process.env.version;

  /**
   * 数据拦截
   */
  intercept(tree: any) {
    if (tree && isString(tree.tag)) {
      const globalComp = this.#compMap.get(tree.tag);
      if (globalComp) {
        tree.tag = globalComp;
      }
    }
    return tree;
  }

  // #region 全局组件
  #compMap = new Map<string, Component>();

  /**
   * 注册全局组件
   * @param name 
   * @param Comp 
   */
  component(name: string, Comp: Component) {
    this.#compMap.set(name, Comp);
    return this;
  }
  // #endregion
}

/**
 * 创建应用
 * @param option 
 * @returns 
 */
export function createApp() {
  return new App({ binding });
}
