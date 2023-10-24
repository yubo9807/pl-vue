import { AnyObj } from "../utils/type";
import { Attrs, Children, Component } from "./type";

const map: WeakMap<Component, AnyObj> = new WeakMap();

export let currentComp = null;
/**
 * 收集实例数据
 * @param comp 
 * @param attrs 
 * @param children 
 */
export function collectInstanceData(comp: Component, attrs: Attrs, children: Children) {
  currentComp = comp;
  const { ref, ...props } = attrs;
  map.set(comp, {
    props,
    slots: children,
  });
}

/**
 * 获取当前组件实例对象
 * @returns 
 */
export function getCurrentInstance() {
  return map.get(currentComp);
}



let currentExportData = null;
/**
 * 定义组件数据出口
 * @param data 
 */
export function defineExpose(data: object) {
  currentExportData = data;
}

/**
 * 收集组件导出数据
 * @param comp 
 * @param attrs 
 * @param children 
 */
export function collectExportsData(comp: Component, attrs: Attrs, children: Children) {
  currentComp = comp;
  if ('ref' in attrs) {
    attrs.ref.value = currentExportData;
  }
  currentExportData = null;
}

