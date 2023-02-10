import { binding, reactive } from "./reactivity/reactive";
import { clone } from "./utils/object";

type Source = () => {}
type Option = {
  immediate?: boolean
  deep?:      boolean
}
type Cb = <T>(newValue: T, oldValue: T) => void

/**
 * 侦听器
 * @param source  响应式数据
 * @param cb      回调函数
 * @param option  配置参数
 * @returns 
 */
export function watch(source: Source, cb: Cb, option: Option = {}): Function {
  let cleanup = false;
  if (cleanup) return;  // 侦听器被取消

  const oldValue = source();
  let backup = clone(oldValue);
  option.immediate && cb(oldValue, void 0);

  // 数据被调用，自执行
  binding(() => {
    if (cleanup) return;  // 被取消监听

    const value = source();
    const bool = option.deep ? compare(value, backup) : value === oldValue;

    if (!bool) {
      cb(value, reactive(backup));  // 源码中是将 oldValue 返回的
      backup = clone(value);
    }
  });

  // 取消监听
  return () => {
    cleanup = true;
  }
}


/**
 * 比较两个对象字段是否一致
 * @param obj1 
 * @param obj2 
 * @returns 一致则返回 true，否则 false
 */
function compare<T>(obj1: T, obj2: T): boolean {
  if (typeof obj1 === 'object' && typeof obj2 === 'object') {
    let flag = true;
    for (const prop in obj1) {
      if (typeof obj1[prop] === 'object') {
        // 递归再次比较
        flag = compare(obj1[prop], obj2[prop]);
      } else {
        if (obj1[prop] !== obj2[prop]) {
          flag = false;
          break;
        };
      }
    }
    return flag;
  } else {
    return obj1 === obj2;
  }
}