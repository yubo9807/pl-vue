import { computed, h } from ".."
import { Config, useRouter } from "./use-router"
import { splicingUrl } from "./utils";

type Props = {
  children?: any[],
  to: Config | string
}
export function RouterLink(props: Props) {

  const href = computed(() => {
    const result = props.to;
    if (typeof result === 'string') {
      return result;
    } else {
      return splicingUrl(result);
    }
  });

  const router = useRouter();
  function jump(e) {
    e.preventDefault();
    router.push(href.value);
  }

  return <a href={href.value} onclick={jump}>{props.children}</a>
}