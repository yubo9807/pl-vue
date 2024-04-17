import { AnyObj, ExcludeKey } from "./utils"
import { ClassNameType, PropsType, StyleType } from "./vdom"

type HTMLAttributes<T extends AnyObj> = PropsType<{
  [K in keyof ExcludeKey<T, 'className' | 'style'>]?: T[K] | (() => T[K])
} & {
  className?: ClassNameType
  style?:     StyleType
  created?:   (el: T) => void
}>

export interface IntrinsicElements {
  a: HTMLAttributes<HTMLAnchorElement>
  audio: HTMLAttributes<HTMLAudioElement>
  base: HTMLAttributes<HTMLBaseElement>
  blockquote: HTMLAttributes<HTMLQuoteElement>
  body: HTMLAttributes<HTMLBodyElement>
  br: HTMLAttributes<HTMLBRElement>
  button: HTMLAttributes<HTMLButtonElement>
  canvas: HTMLAttributes<HTMLCanvasElement>
  col: HTMLAttributes<HTMLTableColElement>
  colgroup: HTMLAttributes<HTMLTableColElement>
  data: HTMLAttributes<HTMLDataElement>
  datalist: HTMLAttributes<HTMLDataListElement>
  del: HTMLAttributes<HTMLModElement>
  details: HTMLAttributes<HTMLDetailsElement>
  dialog: HTMLAttributes<HTMLDialogElement>
  div: HTMLAttributes<HTMLDivElement>
  dl: HTMLAttributes<HTMLDListElement>
  embed: HTMLAttributes<HTMLEmbedElement>
  fieldset: HTMLAttributes<HTMLFieldSetElement>
  form: HTMLAttributes<HTMLFormElement>
  h1: HTMLAttributes<HTMLHeadingElement>
  h2: HTMLAttributes<HTMLHeadingElement>
  h3: HTMLAttributes<HTMLHeadingElement>
  h4: HTMLAttributes<HTMLHeadingElement>
  h5: HTMLAttributes<HTMLHeadingElement>
  h6: HTMLAttributes<HTMLHeadingElement>
  head: HTMLAttributes<HTMLHeadElement>
  hr: HTMLAttributes<HTMLHRElement>
  html: HTMLAttributes<HTMLHtmlElement>
  iframe: HTMLAttributes<HTMLIFrameElement>
  img: HTMLAttributes<HTMLImageElement>
  input: HTMLAttributes<HTMLInputElement>
  ins: HTMLAttributes<HTMLModElement>
  label: HTMLAttributes<HTMLLabelElement>
  legend: HTMLAttributes<HTMLLegendElement>
  li: HTMLAttributes<HTMLLIElement>
  link: HTMLAttributes<HTMLAnchorElement>
  map: HTMLAttributes<HTMLMapElement>
  meta: HTMLAttributes<HTMLMetaElement>
  meter: HTMLAttributes<HTMLMeterElement>
  object: HTMLAttributes<HTMLObjectElement>
  ol: HTMLAttributes<HTMLOListElement>
  optgroup: HTMLAttributes<HTMLOptGroupElement>
  option: HTMLAttributes<HTMLOptionElement>
  output: HTMLAttributes<HTMLOutputElement>
  p: HTMLAttributes<HTMLParagraphElement>
  param: HTMLAttributes<HTMLParamElement>
  pre: HTMLAttributes<HTMLPreElement>
  progress: HTMLAttributes<HTMLProgressElement>
  q: HTMLAttributes<HTMLQuoteElement>
  slot: HTMLAttributes<HTMLSlotElement>
  script: HTMLAttributes<HTMLScriptElement>
  select: HTMLAttributes<HTMLSelectElement>
  source: HTMLAttributes<HTMLSourceElement>
  span: HTMLAttributes<HTMLSpanElement>
  style: HTMLAttributes<HTMLStyleElement>
  table: HTMLAttributes<HTMLTableElement>
  template: HTMLAttributes<HTMLTemplateElement>
  tbody: HTMLAttributes<HTMLTableSectionElement>
  td: HTMLAttributes<HTMLTableDataCellElement>
  textarea: HTMLAttributes<HTMLTextAreaElement>
  tfoot: HTMLAttributes<HTMLTableSectionElement>
  th: HTMLAttributes<HTMLTableHeaderCellElement>
  thead: HTMLAttributes<HTMLTableSectionElement>
  time: HTMLAttributes<HTMLTimeElement>
  title: HTMLAttributes<HTMLTitleElement>
  tr: HTMLAttributes<HTMLTableRowElement>
  track: HTMLAttributes<HTMLTrackElement>
  ul: HTMLAttributes<HTMLUListElement>
  video: HTMLAttributes<HTMLVideoElement>

  abbr: HTMLAttributes<HTMLElement>
  address: HTMLAttributes<HTMLElement>
  area: HTMLAttributes<HTMLAreaElement>
  article: HTMLAttributes<HTMLElement>
  aside: HTMLAttributes<HTMLElement>
  b: HTMLAttributes<HTMLElement>
  bdi: HTMLAttributes<HTMLElement>
  bdo: HTMLAttributes<HTMLElement>
  big: HTMLAttributes<HTMLElement>
  caption: HTMLAttributes<HTMLElement>
  cite: HTMLAttributes<HTMLElement>
  code: HTMLAttributes<HTMLElement>
  dd: HTMLAttributes<HTMLElement>
  dfn: HTMLAttributes<HTMLElement>
  dt: HTMLAttributes<HTMLElement>
  em: HTMLAttributes<HTMLElement>
  figcaption: HTMLAttributes<HTMLElement>
  figure: HTMLAttributes<HTMLElement>
  footer: HTMLAttributes<HTMLElement>
  header: HTMLAttributes<HTMLElement>
  hgroup: HTMLAttributes<HTMLElement>
  i: HTMLAttributes<HTMLElement>
  kbd: HTMLAttributes<HTMLElement>
  keygen: HTMLAttributes<HTMLElement>
  main: HTMLAttributes<HTMLElement>
  mark: HTMLAttributes<HTMLElement>
  menu: HTMLAttributes<HTMLElement>
  menuitem: HTMLAttributes<HTMLElement>
  nav: HTMLAttributes<HTMLElement>
  noindex: HTMLAttributes<HTMLElement>
  noscript: HTMLAttributes<HTMLElement>
  picture: HTMLAttributes<HTMLElement>
  rp: HTMLAttributes<HTMLElement>
  rt: HTMLAttributes<HTMLElement>
  ruby: HTMLAttributes<HTMLElement>
  s: HTMLAttributes<HTMLElement>
  samp: HTMLAttributes<HTMLElement>
  section: HTMLAttributes<HTMLElement>
  small: HTMLAttributes<HTMLElement>
  strong: HTMLAttributes<HTMLElement>
  sub: HTMLAttributes<HTMLElement>
  summary: HTMLAttributes<HTMLElement>
  sup: HTMLAttributes<HTMLElement>
  u: HTMLAttributes<HTMLElement>
  var: HTMLAttributes<HTMLElement>
  wbr: HTMLAttributes<HTMLElement>

  [k: string]: AnyObj
}
