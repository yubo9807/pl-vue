import { ref } from "./ref";

/**
 * 计算属性
 * @param value 
 * @returns 
 */
export function computed(value: Function) {
  return ref(value());
}
