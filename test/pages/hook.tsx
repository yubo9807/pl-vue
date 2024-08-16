import { Fragment, h, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, ref } from "~/core"

function App() {
  const showComp = ref(true);
  function toggle() {
    showComp.value = !showComp.value;
  }

  return <>
    <button onclick={toggle}>toggle</button>
    {() => showComp.value ? <Comp /> : 'world'}
  </>
}

function Comp() {
  const getEl = () => document.getElementById('demo');

  // 组件挂载前执行
  onBeforeMount(() => {
    console.log('onBeforeMount', getEl());  //--> onBeforeMount  null
  });

  // 组件挂载后执行
  onMounted(() => {
    console.log('onMounted', getEl());  //--> onMounted  <div id="demo">hello</div>
  });

  // 组件卸载前执行
  onBeforeUnmount(() => {
    console.log('onBeforeUnmount', getEl());  //--> onBeforeUnmount  <div id="demo">hello</div>
  });

  // 组件卸载后执行
  onUnmounted(() => {
    console.log('onUnmounted', getEl());  //--> onUnmounted  null
  });

  return <span id="demo">hello</span>
}

export default App
