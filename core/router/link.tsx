import { isString } from "../utils"
import { PropsType, h } from "../vdom"
import { config } from "./create-router"
import { BaseOption, SkipOption } from "./type"
import { push, replace } from "./use-router"
import { splicingUrl } from "./utils"

type LinkProps = PropsType<{
  to:         SkipOption
  className?: string
  type?:      'push' | 'replace'
}>
export function Link(props: LinkProps) {
  if (!isString(props.to)) {
    props.to = splicingUrl(props.to as BaseOption);
  }

  function jump(e: Event) {
    e.preventDefault();
    if (props.type === 'push') {
      push(props.to);
    } else {
      replace(props.to);
    }
  }

  return <a className={props.className} href={config.base + props.to} onclick={jump}>{props.children}</a>
}
