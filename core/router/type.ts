import { AnyObj } from "../utils"

export type Config = {
  base?:       string
  mode?:       'history' | 'hash'
  ssrDataKey?: string
}

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
