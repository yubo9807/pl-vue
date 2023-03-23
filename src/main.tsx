import { h, ref, Fragment, render } from "./vue3";
import style from './module.scss';

function App() {
  const count = ref(1);
  return <>
    <Comp text="word" count={() => count.value} />
    {/* 响应式数据写为函数形式 */}
    <h1 className={style.demo}>{() => count.value}</h1>
    <button onclick={() => count.value ++}>click</button>
  </>
}

type CompProps = {
  text: string
  count: () => number  // 想让父组件传递的 props 具有响应式也同样传一个函数类型
}
function Comp(props: CompProps) {
  return <div>
    hello {props.text}
    {props.count}
  </div>
}

document.getElementById('root').appendChild(render(<App />));
