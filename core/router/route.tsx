import { AnyObj } from "../utils"
import { BaseComponent, PropsType, Tree } from "../vdom"
import { config } from "./create-router"
import { BeforeEnter } from "./type"
import { formatUrl } from "./utils"

type RouteProps = PropsType<{
  path:         string
  component:    BaseComponent | (() => Promise<BaseComponent>)
  exact?:       boolean
  beforeEnter?: BeforeEnter
  meta?:        AnyObj
  redirect?:    string
}>
export function Route(props: RouteProps) {}

export type RouteItem = Tree & {
  attrs: RouteProps
}

/**
 * 查找路由
 * @param routes 
 * @param pathname 
 * @returns 
 */
export function queryRoute(routes: RouteItem[], pathname: string) {
  pathname = pathname.replace(config.base, '');
  const query = routes.find(val => {
    const { path, exact } = val.attrs;

    if (exact === false) {
      return (pathname + '/').startsWith(formatUrl(path + '/'));
    }
    return formatUrl(path) === pathname;
  });
  if (!query) return;
  const { path, component, beforeEnter, meta, redirect } = query.attrs;
  return {
    path: formatUrl(path),
    component,
    meta,
    beforeEnter,
    redirect,
  };
}
