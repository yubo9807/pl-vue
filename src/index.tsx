import { isReactive, markRaw, reactive, toRaw, isProxy } from "./reactivity/reactive";
import { customRef, isRef, ref, toRef, toRefs, unref } from "./reactivity/ref";
import { readonly } from "./reactivity/readonly";
import { computed } from "./reactivity/computed";
import { watch, watchEffect } from "./watch";
import { h, Fragment } from "./h";
import { render, renderToString } from "./render";

type Props = {
  text: string
}
function Comp(props: Props) {
  const count = ref(0);

  return <>
    hello {props.text}
    <span>{() => count.value}</span>
    <button onclick={() => count.value ++}>click</button>
  </>
}

function App() {

  const hidden = ref(true);

  return <div>
    <div>
      {() => hidden.value
        ? <span>heihei</span>
        : <Comp text='word' />
      }
    </div>
    <div>
      <button onclick={() => hidden.value = !hidden.value}>{() => hidden.value ? '隐藏' : '显示'}</button>
    </div>
  </div>
}

// const html = renderToString(<App />)
// console.log(html)
document.getElementById('root').appendChild(render(<App />));
