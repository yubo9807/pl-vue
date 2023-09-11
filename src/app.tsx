import { h, ref } from "~/plvue";

function App() {
  const count = ref(0);

  return <div>
    {/* 响应式数据一律以函数形式返回 */}
    <h1>{() => count.value}</h1>
    <button onclick={() => count.value++}>click</button>
  </div>
}

export default App;
