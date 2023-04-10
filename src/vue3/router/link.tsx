import { computed, h } from ".."
import { useHistory } from "./use-history";
import { splicingUrl } from "./utils";

type Props = {
  to:        string
  children?: []
  type?:     'push' | 'replace'
}
export function Link(props: Props = { to: '/', type: 'push' }) {

  const href = computed(() => {
    const result = props.to;
    if (typeof result === 'string') {
      return result;
    } else {
      return splicingUrl(result);
    }
  });

  
  function jump(e: Event) {
    e.preventDefault();
    const history = useHistory();
    if (history.mode === 'history') {
      history.push(href.value);
    } else {
      location.hash = href.value;
    }
  }

  return <a href={href.value} onclick={jump}>{props.children}</a>
}