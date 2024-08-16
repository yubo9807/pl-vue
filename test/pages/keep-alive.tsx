import { Fragment, h, PropsType, ref } from "~/core"

function App() {
  const visible = ref(true);
  function change() {
    visible.value = !visible.value;
  }

  return <>
    <button onclick={change}>showComp</button>
    {() => visible.value
      ? <Comp keepAlive={true} />
      : <div>123</div>
    }
  </>
}

function Comp(props: PropsType<{}>) {
  const count = ref(0);

  return <div>
    <h2>{() => count.value}</h2>
    <button onclick={() => count.value++}>++</button>
  </div>
}

export default App;