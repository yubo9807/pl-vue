import { isType } from "../utils/judge";
import { clone } from "../utils/object";
import { isFragment } from "./h";
import { Attrs, Children, Tag } from "./type";

/**
 * 对 dom 树简单的做下处理，去掉包裹的组件层
 * @param tag 
 * @param attrs 
 * @param children 
 * @returns 
 */
export function createTree(tag: Tag, attrs: Attrs = {}, children: Children = []) {

  if (typeof tag === 'function' && !isFragment(tag)) {  // 组件
    const props = clone(Object.assign({}, attrs, { children }));
    const h = tag(props);
    return createTree(h.tag, h.attrs, h.children);
  }

  const newChildren = []
  children.forEach(val => {
    if (isType(val) === 'object') {
      const h = createTree(val.tag, val.attrs, val.children);
      newChildren.push(h);
    } else {
      newChildren.push(val);
    }
  })
  return { tag, attrs, children: newChildren };

}
