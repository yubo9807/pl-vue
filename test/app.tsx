import { h, ref } from "~/core";

function App() {
  const count = ref(0);

  return <div>
    {/* 响应式数据一律以函数形式返回 */}
    <h1>{() => count.value}</h1>
    <button onclick={() => count.value++}>click</button>
    <my-comp title="hello">
      <p>hhhhhhhh</p>
    </my-comp>
  </div>
}

export default App;
