import { BaseComponent, ClassComponent, Component, GetClassCompPropsType, GetCompPropsType, Tree } from "./type";
import { h } from "./h";
import { Structure } from "./create-element";
import { Static } from "./create-html";
import { binding, effectScope } from '../reactivity';

/**
 * 渲染为 DOM 节点
 * @param tree 
 * @returns 
 */
export function render(tree: Tree) {
  const app = new Structure({ binding, effectScope });
  return app.render(tree);
}

/**
 * 渲染成字符串
 * @param tree 
 * @returns 
 */
export function renderToString(tree: Tree) {
  const app = new Static();
  return app.renderToString(tree);
}

/**
 * 使用组件
 * @param Comp  组件函数
 * @param props 组件参数
 * @returns HTMLElement
 */
export function useComponent<C extends Component>(
  Comp: C,
  props?: C extends ClassComponent
    ? GetClassCompPropsType<typeof Comp>
    : C extends BaseComponent
    ? GetCompPropsType<typeof Comp>
    : never
) {
  return render(h(Comp, props));
}
