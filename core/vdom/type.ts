import { AnyObj } from "../utils"

export type Tag = string | Function
export type Attrs = AnyObj
export type Children = any[]

export type Tree = {
  tag:      Tag
  attrs:    Attrs
  children: Children
}

export type Component = Function

export type PropsType<T extends AnyObj> = T & {
  ref?:      any
  children?: Children
}
