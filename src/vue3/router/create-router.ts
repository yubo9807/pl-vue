import { watch } from "../reactivity/watch";
import { clone } from "../utils/object";
import { AnyObj } from "../utils/type";
import { analysisRoute, currentRoute } from "./use-route";
import { useRouter } from "./use-router";

export type Route = {
  name?:     string
  path:     string
  component: Function
  redirect?: string
  meta?:     AnyObj
  children?: Route[]
}

export let base = '/dist';
export let routes: Route[] = [];


type Option = {
  base:   typeof base
  routes: Route[]
}

/**
 * 创建路由
 * @param option 
 */
export function createRouter(option: Option) {
  base = option.base;
  routes = clone(option.routes);

  function recursion(routes: Route[], prefix = '') {
    routes.forEach(route => {
      route.path = (prefix + route.path).replace(/\/+/, '/');
      if (route.children && route.children.length > 0) {
        recursion(route.children, route.path);
      }
    })
  }
  recursion(routes);

  analysisRoute(location.href);
  window.addEventListener('popstate', () => {
    analysisRoute(location.href);
  })

  watch(() => currentRoute.path, value => {
    const router = useRouter();
    const route = router.getRoutes().find(val => val.path === value);
    if (route) {
      // console.log('组件渲染', route)
    }
  }, { immediate: true })

  return useRouter();

}
