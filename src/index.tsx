import { isReactive, markRaw, reactive, toRaw, isProxy } from "./reactivity/reactive";
import { customRef, isRef, ref, toRef, toRefs, unref } from "./reactivity/ref";
import { readonly } from "./reactivity/readonly";
import { computed } from "./reactivity/computed";
import { watch, watchEffect } from "./watch";
import { h, Fragment } from "./h";
import { render, renderToString } from "./render";

type Props = {
  count: () => number
}
function Comp(props: Props) {

  watch(() => props.count(), value => {
    console.log(value)
  })
  return <span>
    {props.count}
  </span>
}

function App() {

  const count = ref(1);

  return <div>
    <Comp count={() => count.value} />
    <button onclick={() => count.value ++}>click</button>
  </div>
}

const html = renderToString(<App />)
console.log(html)
document.getElementById('root').appendChild(render(<App />));
