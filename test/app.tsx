import { Fragment, h, ref } from "~/core";
import useStore from './store/test';

function App() {
  const count = ref(0);
  const s = useStore()

  return <div>
    {/* 响应式数据一律以函数形式返回 */}
    <h1>{() => s.count}</h1>
    <button onclick={s.add}>click</button>
    <my-comp title="hello">
      <p>hhhhhhhh</p>
    </my-comp>
  </div>
}

export default App;
