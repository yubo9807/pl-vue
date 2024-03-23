import { h, onMounted, ref, useGlobalComponent } from "~/core";
import Comp from "./components/MyComp";

useGlobalComponent('my-comp', Comp);

function App() {
  const count = ref(0);

  const myCompRef = ref();
  onMounted(() => {
    console.log(myCompRef.value);
  })

  return <div>
    {/* 响应式数据一律以函数形式返回 */}
    <h1>{() => count.value}</h1>
    <button onclick={() => count.value++}>click</button>
    <my-comp ref={myCompRef} title="hello">
      <p>hhhhhhhh</p>
    </my-comp>
  </div>
}

export default App;
