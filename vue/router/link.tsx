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
  props = Object.assign({}, defaultProps, props);
  const url = typeof props.to === 'string' ? props.to : splicingUrl(props.to);
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
