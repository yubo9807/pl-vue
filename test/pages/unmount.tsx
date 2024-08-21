import { h, onUnmounted, ref } from "~/core";


function App() {
  const showComp = ref(true);

  return <div>
    <button onclick={() => showComp.value = !showComp.value}>visible</button>
    {() => showComp.value && <Comp />}
    <Comp />
  </div>
}

class Comp {
  render() {
    onUnmounted(() => {
      console.log('unmount')
    })
    return <div>
      hello
    </div>
  }
}

// const Comp = () => {
//   return <div>123</div>
// }

// function Comp() {
//   onUnmounted(() => {
//     console.log('unmount')
//   })
//   return <div>
//     hello
//   </div>
// }

export default App;
