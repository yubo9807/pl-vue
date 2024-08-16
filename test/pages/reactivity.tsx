import { computed, Fragment, h, ref, watch, watchEffect } from "~/core";

function App() {
  const count = ref(0);

  // #region 侦听器，组件卸载后会自动清理
  const newCount = computed(() => count.value + 10);
  const unwatch = watch(count, value => {
    if (value > 10) {
      unwatch();
      return;
    }
    console.log('watch: ', value);
  })
  watchEffect(() => {
    if (newCount.value > 12) {
      newCount.effect.stop();
      return;
    }
    console.log('watchEffect: ', newCount.value);
  })
  // #endregion

  return <>
    <h1>{() => count.value}</h1>
    <button onclick={() => count.value++}>++</button>
  </>
}

export default App;
