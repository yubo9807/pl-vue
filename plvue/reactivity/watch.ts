import { binding } from "./depend";
import { reactive } from "./reactive";
import { isEquals, isMemoryObject } from "../utils/judge";
import { deepClone } from "../utils/object";
import { AnyObj } from "../utils/type";

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
  if (cleanup) return;

  const oldValue = source();
  option.immediate && cb(oldValue, void 0);
  let backup = deepClone(oldValue);

  binding(() => {
    const value = source();
    if (isMemoryObject(value) && option.deep) {
      if (!isEquals(value, backup)) {
        cb(value, backup);
        backup = deepClone(value);
      }
      return;
    }

    if (value !== backup) {
      cb(value, backup);
      backup = value;
    }
  })

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