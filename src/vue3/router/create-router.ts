import { clone } from "../utils/object";
import { AnyObj } from "../utils/type";
import { analysisRoute } from "./use-route";
import { useRouter } from "./use-router";
import { formatPath } from "./utils";

export type Route = {
  name?:     string
  path:      string
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
      route.path = formatPath(prefix + route.path);
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

  return useRouter();

}
