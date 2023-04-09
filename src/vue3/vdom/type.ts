import { AnyObj } from "../utils/type"

export type Tag = string | Function
export type Attrs = AnyObj
export type Children = any[]

export type Tree = {
  tag:      Tag
  attts:    Attrs
  children: Children
}

export type Component = Function
