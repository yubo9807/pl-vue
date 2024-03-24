/**
 * 键的类型
 */
export type Key = string | symbol

/**
 * 任意类型对象
 */
export type AnyObj = Record<Key, any>

/**
 * 比较宽泛的类
 */
export type WideClass = new (...args: any[]) => AnyObj
