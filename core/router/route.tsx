import { AnyObj, customFind } from "../utils"
import { BaseComponent, KeepAliveValue, Tree } from "../vdom"
import { config } from "./create-router"
import { BeforeEnter } from "./type"
import { formatUrl } from "./utils"

type RoutePropsBase = {
  path:   string
  exact?: boolean
}
type RoutePorps = RoutePropsBase & {
  component:    BaseComponent | (() => Promise<BaseComponent>)
  meta?:        AnyObj
  keepAlive?:   KeepAliveValue
  beforeEnter?: BeforeEnter
}
type RoutePorpsRedirect = RoutePropsBase & {
  redirect:  string
}
export function Route(props: RoutePorps): void
export function Route(props: RoutePorpsRedirect): void
export function Route(props) {}

export type RouteItem = Tree & {
  attrs: RoutePorps
}

/**
 * 查找路由
 * @param routes 
 * @param pathname 
 * @returns 
 */
export function queryRoute(routes: RouteItem[], pathname: string) {
  pathname = pathname.replace(config.base, '');
  const query = customFind(routes, val => {
    const { path, exact } = val.attrs;

    if (exact === false) {
      return (pathname + '/').startsWith(formatUrl(path + '/'));
    }
    return formatUrl(path) === pathname;
  });
  if (!query) return;
  const { path, component, beforeEnter, meta, redirect, keepAlive } = query.attrs;

  return {
    path: formatUrl(path),
    component,
    meta,
    beforeEnter,
    keepAlive,
    redirect,
  };
}
