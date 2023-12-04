import { Component, PropsType, Tree } from "../vdom"
import { BeforeEnter } from "./type"
import { formatUrl } from "./utils"

type RouteProps = PropsType<{
  path:         string
  component:    Component | (() => Promise<Component>)
  exact?:       boolean
  beforeEnter?: BeforeEnter
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
  const query = routes.find(val => {
    const { path, exact } = val.attrs;

    if (exact === false) {
      return (pathname + '/').startsWith(formatUrl(path + '/'));
    }
    return formatUrl(path) === pathname;
  });
  if (!query) return;
  const { path, component, beforeEnter } = query.attrs;
  return {
    path: formatUrl(path),
    component,
    beforeEnter,
  };
}
