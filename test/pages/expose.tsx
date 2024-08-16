import { defineExpose, h, ref } from "~/core"

type CompExpose = {
  add: () => void
}
function Comp() {
  const count = ref(0);

  defineExpose<CompExpose>({
    add() {
      count.value++
    }
  })

  return <div>{() => count.value}</div>
}


function App() {
  const compRef = ref<CompExpose>();

  function add() {
    compRef.value.add();
  }

  return <div>
    <Comp ref={compRef} />
    <button onclick={add}>++</button>
  </div>
}

export default App;
