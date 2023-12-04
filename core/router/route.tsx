import { Component, PropsType, Tree } from "../vdom"
import { RouteOption } from "./type"
import { formatUrl } from "./utils"

type RouteProps = PropsType<{
  path:         string
  component:    Component | (() => Promise<Component>)
  exact?:       boolean
  beforeEnter?: (to: RouteOption, from: RouteOption, next: () => void) => void
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

    if (exact === true) {
      return path === pathname;
    }
    return (pathname + '/').startsWith(formatUrl(path + '/'));
  });
  if (!query) return;
  const { path, component, beforeEnter } = query.attrs;
  return {
    path: formatUrl(path),
    component,
    beforeEnter,
  };
}
