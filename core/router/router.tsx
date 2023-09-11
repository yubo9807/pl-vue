import { Fragment, h } from '../vdom/h';
import { toRaw } from '../reactivity/reactive';
import { ref } from '../reactivity/ref';
import { watch } from '../reactivity/watch';
import { Component } from '../vdom/type';
import { currentRoute, config, routeChange } from './create-router';
import { isBrowser } from '../utils/judge';
import { findRoute, getBrowserUrl } from './utils';
import { StaticRouter } from './ssr';


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
  watch(() => currentRoute.monitor, async value => {
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

export function Router(props: BrowserRouterProps) {
  return isBrowser()
    ? <BrowserRouter {...props} />
    : <StaticRouter />
}
