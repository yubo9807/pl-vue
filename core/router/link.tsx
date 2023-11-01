import { isString, objectAssign } from "../utils";
import { h } from "../vdom";
import { config } from "./create-router";
import { useRouter } from "./use-router";
import { RouteOptionOptional, splicingUrl } from "./utils";

type Props = {
  to:        RouteOptionOptional | string
  children?: []
  type?:     'push' | 'replace'
  className?: string
}
const defaultProps = { to: '/', type: 'push' }

export function Link(props: Props) {
  props = objectAssign(defaultProps, props);
  const url = isString(props.to) ? props.to : splicingUrl(props.to as RouteOptionOptional);
  const href = config.base + (config.mode === 'hash' ? '#' + url : url);

  const router = useRouter();
  function jump(e: Event) {
    e.preventDefault();
    if (props.type === 'push') {
      router.push(url);
    } else {
      router.replace(url);
    }
  }

  return <a className={props.className} href={href} onclick={jump}>{props.children}</a>
}
