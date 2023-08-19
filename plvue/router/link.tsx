import { isString } from "../utils/judge";
import { objectAssign } from "../utils/object";
import { h } from "../vdom/h";
import { config } from "./use-route";
import { useRouter } from "./use-router";
import { RouteOption, splicingUrl } from "./utils";

type Props = {
  to:        RouteOption | string
  children?: []
  type?:     'push' | 'replace'
}
const defaultProps = { to: '/', type: 'push' }

export function Link(props: Props) {
  props = objectAssign(defaultProps, props);
  const url = isString(props.to) ? props.to : splicingUrl(props.to as RouteOption);
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

  return <a href={href} onclick={jump}>{props.children}</a>
}
