import { binding } from "./depend";
import { reactive } from "./reactive";
import { isEquals, isObject } from "../utils/judge";
import { clone } from "../utils/object";

type Option = {
  immediate?: boolean
  deep?:      boolean
}

/**
 * 侦听器
 * @param source  响应式数据
 * @param cb      回调函数
 * @param option  配置参数
 * @returns unwatch() 取消监听
 */
export function watch<T>(source: () => T, cb: (newValue: T, oldValue: T) => void, option: Option = {}): Function {
  let cleanup = false;
  if (cleanup) return;  // 侦听器被取消

  const oldValue = source();
  let backup = clone(oldValue);
  option.immediate && cb(oldValue, void 0);

  // 数据被调用，自执行
  binding(() => {
    if (cleanup) return true;  // 被取消监听

    const value = source();

    if (isObject(oldValue)) {
      if (option.deep && !isEquals(value, backup)) {
        cb(value, reactive(backup));
        backup = clone(value);
      }
    } else {
      if (value !== backup) {
        cb(value, reactive(backup));  // 源码中是将 oldValue 返回的
        backup = clone(value);
      }
    }

    
  });

  // 取消监听
  return () => {
    cleanup = true;
  }
}

type OnCleanup = (cleanupFn: () => void) => void
type Callback = (onCleanup: OnCleanup) => void

/**
 * 立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行
 * @param cb 
 * @returns stop() 取消监听
 */
export function watchEffect(cb: Callback) {
  let cleanup = false;
  let lock = false;

  binding(() => {
    if (cleanup) return true;
    cb((cleanupFn) => {
      lock && cleanupFn();  // 第一次不执行
      lock = true;
    });
  })

  return () => {
    cleanup = true;
  }
}