import { Component, IntailOption, Tree } from "./type";
import { Element } from "./create-element"; 
import { isString } from "../utils";

type Plugin = {
  install: (app: App) => void;
}
export class App extends Element {

  constructor(config: IntailOption) {
    super(config);
    this.config = config;
  }

  use = (plugin: Plugin) => {
    plugin.install(this);
    return this;
  }

  version = process.env.version;

  /**
   * 数据拦截
   */
  intercept(tree: Tree) {
    if (isString(tree.tag)) {
      const globalComp = this.getComponent(tree.tag);
      if (globalComp) {
        tree.tag = globalComp;
      }
    }
    return tree;
  }

  // #region 全局组件
  #compMap = new Map<string, Component>();

  /**
   * 获取全局组件
   * @param name 
   * @returns 
   */
  getComponent(name: string) {
    return this.#compMap.get(name);
  }

  /**
   * 注册全局组件
   * @param name 
   * @param Comp 
   */
  useComponent = (name: string, Comp: Component) => {
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
export function createApp(option: IntailOption = {}) {
  return new App(option);
}
