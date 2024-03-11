import { PropsType, h, onMounted, ref, useComponent } from "~/core";

function App() {
  const count = ref(0);

  return <div>
    {/* 响应式数据一律以函数形式返回 */}
    <h1>{() => count.value}</h1>
    <button onclick={() => count.value++}>click</button>
    <Comp a={1212} />
  </div>
}

class Comp {
  o
  constructor(props: PropsType<{ a: number }>) {
    this.o = props
  }
  render() {
    onMounted(() => {
      console.log(this.o)
    })
    return <div>111</div>
  }
}

export default App;
