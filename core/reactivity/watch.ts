import { binding, currentKeys } from "./depend";
import { isEquals, deepClone, isNormalObject, nextTick, Key } from "../utils";
import { collectMonitor } from "./scope";

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
  let first = true;

  binding(() => {
    if (cleanup) return true;

    const value = source();

    // 是一个对象
    if (isNormalObject(value)) {
      if (option.deep && !isEquals(value, backup)) {
        cb(value, backup);
        backup = deepClone(value);
      }
      return;
    }

    // 原始值
    if (first) {  // 第一次不进行回调，上面已经执行过一次
      first = false;
      return;
    }

    if (value !== backup) {
      cb(value, backup);
      backup = value;
    }
  })

  const result = () => {
    cleanup = true;

    // 释放内存
    backup = source = cb = option = null;
  }

  collectMonitor(result);
  return result;
}

type OnCleanup = (cleanupFn: () => void) => void
type Callback  = (onCleanup: OnCleanup)  => void

/**
 * 立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行
 * @param cb 
 * @returns stop() 取消监听
 */
export function watchEffect(cb: Callback) {
  let cleanup = false;
  let isFirst = true;
  let count = 0;
  let monitorKeys: typeof currentKeys = null;  // 监听的 key

  binding((updateKeys) => {
    if (cleanup) return true;

    if (count > 0) return;  // 保证该函数在同一时刻只会触发一次
    count++;
    nextTick(() => count = 0);

    if (!isFirst) {
      // 如果更新的 key 中找不到监听的 key，不执行回调
      for (const key of updateKeys) {
        if (!monitorKeys.has(key)) return;
      }
    };

    cb((cleanupFn) => {
      cleanupFn();
    });

    if (isFirst) {
      // 第一次执行后，知道了需要监听的 key
      monitorKeys = currentKeys;
      isFirst     = false;
    }
  })

  const result = () => {
    cleanup = true;

    // 释放内存
    cb = monitorKeys = null;
  }

  collectMonitor(result);
  return result;
}