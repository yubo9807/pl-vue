import { Fragment, h } from '../vdom/h';
import { toRaw } from '../reactivity/reactive';
import { ref } from '../reactivity/ref';
import { watch } from '../reactivity/watch';
import { Component } from '../vdom/type';
import { currentRoute, getBrowserUrl, config, routeChange, findRoute } from './create-router';
import { isBrowser } from '../utils/judge';
import { analyzeRoute } from './utils';


type Props = {
  children?: []
}

interface BrowserRouterProps extends Props {
  loading?: Component
}
/**
 * 浏览器端路由渲染
 * @param props 
 * @returns 
 */
function BrowserRouter(props: BrowserRouterProps) {

  window.addEventListener('popstate', () => {
    routeChange(getBrowserUrl());
  })

  const currentComp = ref(null);
  let data = void 0;
  watch(() => currentRoute.path, async value => {
    const find = findRoute(value);
    if (!find) return;
    const { getInitialProps } = find.component.prototype;
    if (typeof getInitialProps === 'function') {
      if (window[config.ssrDataKey]) {
        data = window[config.ssrDataKey];
        delete window[config.ssrDataKey];
      } else {
        currentComp.value = props.loading;
        const route = toRaw(currentRoute);
        data = await getInitialProps(route);
      }
    }
    currentComp.value = find.component;
  }, { immediate: true })

  return <>{() => currentComp.value && <currentComp.value data={data} />}</>;
}



interface StaticRouterProps extends Props {
  url?:  string  // 渲染路径
  data?: any     // 服务端获取数据
}
/**
 * 服务端渲染
 * @param props 
 * @returns 
 */
function StaticRouter(props: StaticRouterProps) {

  let url = ''
  if (config.mode === 'history') {
    url = props.url.replace(config.base, '');
  } else {
    const match = props.url.match(/#.*/);
    url = match ? match[0] : '';
  }

  routeChange(url);

  const find = findRoute(currentRoute.path);
  return <>{find && <find.component data={props.data} />}</>;
}

/**
 * 生成节点前执行组件的 getInitialProps 方法
 * @param url 
 * @returns 
 */
export async function execGetInitialProps(url: string) {
  const currentRoute = analyzeRoute(url);
  const find = findRoute(currentRoute.path);
  if (!find) return;

  const { getInitialProps } = find.component.prototype;
  if (typeof getInitialProps === 'function') {
    return await getInitialProps(currentRoute);
  }
}



export function Router(props: StaticRouterProps & BrowserRouterProps) {
  return isBrowser()
    ? <BrowserRouter {...props} />
    : <StaticRouter {...props} />
}
