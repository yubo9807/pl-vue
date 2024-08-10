import { RefImpl } from "../reactivity"
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
  ref?:       RefImpl<unknown>
  children?:  T['children'] | Children
  keepAlive?: boolean
}

export type BaseComponent = (props?: PropsType<{ [k: string]: any }>) => any
export type ClassComponent = new (props?: PropsType<{}>) => void

export type Component = BaseComponent | ClassComponent

export type GetCompPropsType<Comp extends BaseComponent> = Parameters<Comp>[0]
export type GetClassCompPropsType<ClassComp extends ClassComponent> = ConstructorParameters<ClassComp>[0]

type AssignType = string | number | (() => string | number)

export type ClassNameType = AssignType | AssignType[]

export type StyleObject = {
  [I in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[I] | (() => CSSStyleDeclaration[I])
} & {
  [k: `--${string}`]: AssignType
}

export type StyleType = AssignType | StyleObject
