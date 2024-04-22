import { isString } from "../utils"
import { ClassNameType, PropsType, h } from "../vdom"
import { config } from "./create-router"
import { SkipOption } from "./type"
import { push, replace, useRoute } from "./use-router"
import { splicingUrl } from "./utils"

type LinkProps = PropsType<{
  to:          SkipOption
  className?:  ClassNameType
  type?:       'push' | 'replace'
  onClick?:    (to: string, next: (to?: SkipOption) => void) => void
}> & {
  [K in keyof HTMLAnchorElement]?: any
}
export function Link(props: LinkProps) {
  const { to, type, className, children, onClick, ...args } = props;

  const route = useRoute();

  if (!isString(to)) {
    props.to = splicingUrl(Object.assign({}, route, to));
  }

  const href = config.mode === 'hash' ? `${config.base}#${props.to}` : config.base + props.to;

  function jump(e: Event) {
    e.preventDefault();

    function next(to = props.to) {
      type === 'replace' ? replace(to) : push(to);
    }

    if (onClick) {
      onClick(props.to as string, next);
    } else {
      next();
    }
  }

  const currentPath = props.to + '/';
  return <a
    className={[
      () => (route.path + '/').startsWith(currentPath) && 'active',
      () => route.path + '/' === currentPath && 'exact-active',
      ...[className].flat(),
    ]}
    href={href}
    onclick={jump}
    {...args}
  >{children}</a>
}
