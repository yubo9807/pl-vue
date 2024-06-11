import { customForEach } from "../utils";
import { ComputedRefImpl, computed } from "./computed";
import { watch, watchEffect } from "./watch";

type MonitorType = ReturnType<typeof watch | typeof watchEffect | typeof computed>;
let scopeId: symbol;
const monitorMap: Map<symbol, MonitorType[]> = new Map();

/**
 * 记录当前侦听器
 * @param monitor 
 */
export function collectMonitor(monitor: MonitorType) {
  if (!scopeId) return;
  const monitorList = monitorMap.get(scopeId) || [];
  monitorList.push(monitor);
  monitorMap.set(scopeId, monitorList);
}

class EffectScope {

  #id = Symbol();

  /**
   * 捕获其中所创建的响应式副作用(计算属性和侦听器)
   * @param fn 
   * @returns 
   */
  run<T>(fn: () => T): T | void {
    scopeId = this.#id;
    const result = fn();
    scopeId = null;
    return result;
  }

  /**
   * 处理掉当前作用域内的所有 effect
   * @returns 
   */
  stop() {
    const monitorList = monitorMap.get(this.#id);
    if (!monitorList) return;
    customForEach(monitorList, val => {
      if (val instanceof ComputedRefImpl) {
        val.effect.stop();
      } else {
        val();
      }
    })
    monitorMap.delete(this.#id);
  }

}

/**
 * 创建一个 effect 作用域
 * @returns 
 */
export function effectScope() {
  return new EffectScope();
}
