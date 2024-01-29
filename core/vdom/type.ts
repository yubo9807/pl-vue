import { RefImpl } from "../reactivity/ref"
import { AnyObj } from "../utils"

export type Tag = string | Component
export type Attrs = AnyObj
export type Children = any[]

export type Tree = {
  tag:      Tag
  attrs:    Attrs
  children: Children
}

export type PropsType<T extends AnyObj> = T & {
  ref?:      RefImpl<unknown>
  children?: Children
}

export type BaseComponent = (props?: PropsType<{ [k: string]: any }>) => any
export type ClassComponent = new (props?: PropsType<{}>) => any

export type Component = BaseComponent | ClassComponent

export type GetCompPropsType<Comp extends BaseComponent> = Parameters<Comp>[0]
export type GetClassCompPropsType<ClassComp extends ClassComponent> = Parameters<InstanceType<ClassComp>['render']>[0]
