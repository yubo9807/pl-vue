import { createColor } from "@/utils/string";
import { h, onUnmounted, ref, computed } from "~/pvue";
import style from './style.module.scss';
import useStore from '@/store/count';

function Home(props) {
  const store = useStore();
  const count = ref(0);
  const elTitle = ref(null);

  onUnmounted(Home, () => {
    console.log(Home.name, '组件被卸载');
  })

  return <div className={style['page-home']}>
    <h1>
      Store: {() => store.count }
    </h1>
    <button onclick={() => store.setCount(++store.count)}>Store change</button>
    <h1 ref={elTitle}>
      Ref: count&nbsp;
      <span className={style['red-font']}>{() => count.value}</span>
    </h1>
    <button onclick={() => count.value++}>count++</button>
    <Comp count={() => count.value} />
    <h1>Page.getInitialProps: {props.data}</h1>
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

  return <h1 style={{ color: () => color.value }}>
    子组件 {props.count}
  </h1>
}

export default Home;
