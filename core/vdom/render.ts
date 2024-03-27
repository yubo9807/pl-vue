import { BaseComponent, ClassComponent, Component, GetClassCompPropsType, GetCompPropsType } from "./type";
import { h } from "./h";
import { Element } from "./create-element";

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
  const app = new Element();
  return app.render(h(Comp, props));
}
