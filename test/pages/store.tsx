import { Fragment, h, ref } from "~/core"
import { defineStore } from "~/core/store"

const state = {
  count: 0,
}
const actions = {
  augment() {
    state.count++;
  },
  decrease() {
    state.count--;
  },
}
const useStore = defineStore({ state, actions });

function App() {
  const store = useStore();
  const visible = ref(true);
  return <>
    <button onclick={() => visible.value = !visible.value}>visible</button>
    {() => visible.value ? <Page1 /> : <Page2 />}
  </>
}

function Page1() {
  const store = useStore();
  return <div>
    Page1: {() => store.count}
    <button onclick={store.augment}>++</button>
  </div>
}
function Page2() {
  const store = useStore();
  return <div>
    Page2: {() => store.count}
    <button onclick={store.decrease}>--</button>
  </div>
}

export default App;
