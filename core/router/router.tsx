import { Fragment, h, Component } from '../vdom';
import { currentRoute, config, routeChange, isReady } from './create-router';
import { isBrowser, isFunction } from '../utils';
import { findRoute, getBrowserUrl } from './utils';
import { StaticRouter } from './ssr';
import { toRaw, ref, watch } from '../reactivity';


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
    if (isFunction(getInitialProps)) {
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

  return <>{() => {
    const ready = isReady.value;
    const Comp = currentComp.value;
    return ready && Comp && <Comp data={data} />
  }}</>;
}

export function Router(props: BrowserRouterProps) {
  return isBrowser()
    ? <BrowserRouter {...props} />
    : <StaticRouter />
}
