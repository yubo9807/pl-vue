import { isString } from "../utils/judge";
import { objectAssign } from "../utils/object";
import { h } from "../vdom/h";
import { base, mode } from "./init-router";
import { useRouter } from "./use-router";
import { Config, formatPath, splicingUrl } from "./utils";

type Props = {
  to:        Config | string
  children?: []
  type?:     'push' | 'replace'
}
const defaultProps = { to: '/', type: 'push' }

export function Link(props: Props) {
  props = objectAssign(defaultProps, props);
  const url = isString(props.to) ? props.to : splicingUrl(props.to as Config);
  const href = formatPath(base + (mode === 'hash' ? '#' + url : url));

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
