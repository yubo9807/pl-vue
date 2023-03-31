import { h, ref, Fragment, render, renderToString } from "./vue3";
import style from './module.scss';

function App() {
  const count = ref(1);
  return <>
    {/* 响应式数据写为函数形式 */}
    父组件
    <h1 className={style.demo}>{() => count.value}</h1>
    <Comp count={() => count.value}>
      <p>插槽1</p>
      <p>插槽2</p>
    </Comp>
    <button onclick={() => count.value ++}>click</button>
  </>
}

type CompProps = {
  children?: any
  count: () => number  // 想让父组件传递的 props 具有响应式也同样传一个函数类型
}
function Comp(props: CompProps) {
  return <div>
    <p>子组件</p>
    <p>props: {props.count}</p>
    <p>{props.children}</p>
  </div>
}

// console.log(renderToString(<App />))
document.getElementById('root').appendChild(render(<App />));
