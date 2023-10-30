import { Attrs, Component } from "./type";


export let currentComp = null;
/**
 * 收集实例数据
 * @param comp 
 * @param attrs 
 * @param children 
 */
export function recordCurrentComp(comp: Component) {
  currentComp = comp;
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
export function collectExportsData(comp: Component, attrs: Attrs) {
  currentComp = comp;
  if ('ref' in attrs) {
    attrs.ref.value = currentExportData;
  }
  currentExportData = null;
}

