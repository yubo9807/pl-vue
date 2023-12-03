import { Component, PropsType, Tree } from "../vdom"
import { formatUrl } from "./utils"

type RouteProps = PropsType<{
  path:      string
  component: Component | (() => Promise<Component>)
  exact?:    boolean

}>
export function Route(props: RouteProps) {}

type RouteItem = Tree & {
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
  return {
    path: formatUrl(query.attrs.path),
    component: query.attrs.component,
  };
}
