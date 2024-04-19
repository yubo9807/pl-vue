import { Fragment, binding, h, onMounted, reactive, ref, watch, watchEffect } from "~/core";
import { isStrictObject, isType } from "~/core/utils";

function App() {
  const count = reactive({
    value: 0,
    o: {
      a: 1
    }
  });


  return <div>
    {/* 响应式数据一律以函数形式返回 */}
    <h1>{() => count.value}</h1>
    <button onclick={() => count.value ++}>click</button>
  </div>
}

function delay(ms = 2000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(1);
      console.log(111111)
    }, ms)
  });
}

export default App;
