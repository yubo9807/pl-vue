import { isString } from "../utils"
import { PropsType, h } from "../vdom"
import { config } from "./create-router"
import { BaseOption, SkipOption } from "./type"
import { push, replace, useRoute } from "./use-router"
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

  const route = useRoute();

  return <a
    className={() => {
      const currentPath = props.to + '/';
      const routePath = route.path + '/';
      return [
        routePath.startsWith(currentPath) && 'active',
        routePath === currentPath && 'exact-active',
        props.className,
      ]
    }}
    href={href}
    onclick={jump}
  >{props.children}</a>
}
