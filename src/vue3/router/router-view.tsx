import { Fragment, h, ref, watch } from ".."
import { currentRoute } from "./use-route"
import { useRouter } from "."

export function RouterView() {
  const CurrentComp = ref(null);

  watch(() => currentRoute.path, value => {
    const router = useRouter();
    const route = router.getRoutes().find(val => val.path === value);
    if (route) {
      CurrentComp.value = route.component;
    }
  }, { immediate: true })

  return <>
    {() => <CurrentComp.value />}
  </>
}
