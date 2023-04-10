import { onMounted } from '../hooks';
import { Fragment, h } from '../vdom/h';
import { Component } from '../vdom/type';
import { useHistory } from './use-history';

type RouteProps = {
  path?:     string
  component: Component
  exact?:    boolean
  redirect?: string
}
/**
 * 显示对应的路由
 * @param props 
 * @returns 
 */
export function Route(props: RouteProps) {
  const Comp = props.component;
  return <Comp />
}
const route = Symbol('Route');
Route.prototype[route] = route;
export function isRoute(comp: Function) {
  return comp.prototype[route] === route;
}



type RedirectProps = {
  to: string
}
/**
 * 重定向
 * @param props 
 * @returns 
 */
export function Redirect(props: RedirectProps) {
  const history = useHistory();
  onMounted(() => {
    history.replace(props.to);
  })

  return <div></div>
}
