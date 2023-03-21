// 任意类型对象
export type AnyObj = {
  [prop: string | number | symbol]: any
}

/**
 * 不能是某种类型
 */
export type BanType<T, E> = T extends E ? never : T
// function fn<T>(a: BanType<T, Date>) {}

export type Key = string | number | symbol
