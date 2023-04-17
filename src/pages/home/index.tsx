import { createColor } from "@/utils/string";
import { h, onUnmounted, ref, computed } from "~/vue";
import style from './module.scss';

function Home(props) {
  console.log('Home', props.data)
  const count = ref(0);
  const elTitle = ref(null);

  onUnmounted(Home, () => {
    console.log('Home 组件被卸载');
  })

  return <div className={style['page-home']}>
    <h1 ref={elTitle}>
      count&nbsp;
      <span className={style['red-font']}>{() => count.value}</span>
    </h1>
    <button onclick={() => count.value++}>count++</button>
    <Comp count={() => count.value} />
    <p>{props.data}</p>
  </div>
}

Home.prototype.getInitialProps = async () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(123);
    }, 300)
  })
}



type CompProps = {
  count: () => number
}
function Comp(props: CompProps) {
  const color = computed(() => createColor().slice(0, -1) + props.count().toString().slice(0, 1));

  return <div style={{ color: () => color.value }}>
    子组件 {props.count}
  </div>
}

export default Home;
