import { h, Fragment, ref, createContext } from "~/core"

const level = createContext<{  // 创建上下文数据管理对象
  add?: () => void  // 类型定义
  num?: number
}>();

function App() {
  const count = ref(1);
  function add() {
    count.value++
  }
  level.provide({ add });  // 向子孙组件提供数据

  return <>
    <h1>{() => count.value}</h1>
    App: <button onclick={add}>++</button>
    <Page />
  </>
}

function Page() {
  console.log('Page: ', level.inject());
  level.provide({ num: 123 });
  return <Comp />
}

function Comp() {
  const data = level.inject();  // 获取上层组件提供数据
  console.log('Comp: ', data);
  return <div>
    Comp: <button onclick={data.add}>++</button>
  </div>
}

export default App;
