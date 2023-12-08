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

  const href = config.mode === 'hash' ? `${config.base}#${props.to}` : config.base + props.to;

  function jump(e: Event) {
    e.preventDefault();
    if (props.type === 'replace') {
      replace(props.to);
    } else {
      push(props.to);
    }
  }

  return <a className={props.className} href={href} onclick={jump}>{props.children}</a>
}
