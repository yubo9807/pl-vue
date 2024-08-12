import { AnyObj } from "../utils"
import { KeepAliveValue } from "../vdom"

export type BaseOption = {
  path?:  string
  query?: AnyObj
  hash?:  string
}
export type SkipOption = string | BaseOption

export type RouteOption = {
  fullPath: string
  path:     string
  query:    AnyObj
  hash:     string
  meta?:    AnyObj
}

export type GetInitialPropsOption = {
  path?:      string
  meta?:      AnyObj
  keepAlive?: KeepAliveValue
}

export interface PagePropsType extends GetInitialPropsOption {
  data?: any
}

export type BeforeEnter = (to: RouteOption, from: RouteOption, next: () => void) => void
