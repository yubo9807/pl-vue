import { h, onUnmounted, ref, computed } from "@/vue3";
import style from './module.scss';

function Home() {
  const count = ref(0);
  const elTitle = ref(null);

  // onMounted(() => {
  //   console.log(elTitle.value);
  // })

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
  </div>
}

type CompProps = {
  count: () => number
}
function Comp(props: CompProps) {
  const top = computed(() => props.count() + 'px');

  return <div style={{ marginTop: () => top.value }}>
    子组件 {props.count}
  </div>
}

export default Home;
