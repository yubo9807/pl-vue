import { isString } from "../utils"
import { PropsType, h } from "../vdom"
import { config } from "./create-router"
import { SkipOption } from "./type"
import { push, replace, useRoute } from "./use-router"
import { splicingUrl } from "./utils"

type LinkProps = PropsType<{
  to:          SkipOption
  className?:  string
  type?:       'push' | 'replace'
  [k: string]: any
}>
export function Link(props: LinkProps) {
  const { to, type, className, children, ...args } = props;

  const route = useRoute();

  if (!isString(to)) {
    props.to = splicingUrl(Object.assign({}, route, to));
  }

  const href = config.mode === 'hash' ? `${config.base}#${props.to}` : config.base + props.to;

  function jump(e: Event) {
    e.preventDefault();
    if (type === 'replace') {
      replace(props.to);
    } else {
      push(props.to);
    }
  }

  return <a
    className={() => {
      const currentPath = props.to + '/';
      const routePath = route.path + '/';
      return [
        routePath.startsWith(currentPath) && 'active',
        routePath === currentPath && 'exact-active',
        className,
      ]
    }}
    href={href}
    onclick={jump}
    {...args}
  >{children}</a>
}
