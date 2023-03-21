import { watch, h, ref, Fragment, render } from "./vue3";

type Props = {
  count: () => number
}
function Comp(props: Props) {

  const unwatch = watch(() => props.count(), value => {
    if (value >= 5) unwatch();
    console.log(value);
  }, { immediate: true })

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

document.getElementById('root').appendChild(render(<App />));
