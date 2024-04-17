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

/**
 * 排除对象中的某个 key
 */
export type ExcludeKey<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
// type A = { a: number, b: number, c: string }
// type B = ExcludeKey<A, 'a'>
