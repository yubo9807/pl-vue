import { RefImpl, h, ref, createContext, onUnmounted } from "~/core";

const context = createContext<{
  a:      number
  b?:     number
  count?: RefImpl<number>,
  add?:   Function
}>({ a: 123 });

function App() {
  

  const isPage = ref(true);
  return <div>
    {() => isPage.value && <Page />}
    <button onclick={() => isPage.value = !isPage.value}>{() => isPage.value ? '卸载Page' : '加载Page'}</button>
  </div>
}

function Page() {
  const count = ref(0);
  function add() {
    count.value++;
  }
  context.provide({ add })

  return <div>
    <h2>{() => count.value}</h2>
    <button onclick={add}>add</button>
    <Comp />
  </div>
}


function Comp() {
  const contextData = context.inject();
  console.log(contextData);

  onUnmounted(() => {
    const contextData = context.inject();
    console.log(contextData)
  })

  return <div>comp
    <button onclick={() => contextData.add()}>++</button>
  </div>
}

export default App;
