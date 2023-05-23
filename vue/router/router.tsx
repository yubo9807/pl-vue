import { ref } from '../reactivity/ref';
import { watch } from '../reactivity/watch';
import { Fragment, h } from '../vdom/h';
import { Component, Tree } from '../vdom/type';
import { base, isBrowser, mode, ssrDataKey } from './init-router';
import { isRoute } from './route';
import { analysisRoute, currentRoute } from './use-route';

type Props = {
  children?: []
}
interface BrowserRouterProps extends Props {
  Loading?: Component
}
interface StaticRouterProps extends Props {
  url?:  string  // 渲染路径
  data?: any     // 服务端获取数据
}

let isFirstRender = true;  // 是否为第一次渲染

/**
 * 监听路由变化
 * @param props 
 * @returns 
 */
function watchRoutePath(props: StaticRouterProps & BrowserRouterProps, isBrowser = true) {
  const CurrentComp = ref(null);
  const data = ref(void 0);

  watch(() => currentRoute.path, async value => {
    const routes = props.children.filter((tree: Tree) =>
      typeof tree === 'object' && isRoute(tree.tag as Function));

    const tree: Tree = routes.find((tree: Tree) => {
      if (tree.attrs.exact) {
        return value === tree.attrs.path;
      } else {
        return (value + '/').startsWith(tree.attrs.path + '/');
      }
    });

    if (tree) {
      // 能匹配到响应路径
      if (isBrowser){  // 客户端组件渲染
        const Comp = tree.attrs.component;
        if (typeof Comp.prototype.getInitialProps === 'function') {
          if (isFirstRender && window[ssrDataKey]) {
            data.value = window[ssrDataKey];
            delete window[ssrDataKey];
            isFirstRender = false;
          } else {
            if (props.Loading) CurrentComp.value = props.Loading;
            data.value = await Comp.prototype.getInitialProps();
          }
        } else {
          data.value = void 0;
        }
        CurrentComp.value = Comp;
      } else {  // 服务端组件渲染
        CurrentComp.value = tree.attrs.component;
      }
    } else {
      const tree: Tree = routes[routes.length - 1];
      // 设置了 NotFound 组件
      if (typeof tree === 'object' && isRoute(tree.tag as Function) && !tree.attrs.path) {
        CurrentComp.value = tree.attrs.component;
      } else {
        CurrentComp.value = null;
      }
    }
  }, { immediate: true })

  return {
    CurrentComp,
    data,
  }
}



/**
 * 浏览器端路由渲染
 * @param props 
 * @returns 
 */
function BrowserRouter(props: BrowserRouterProps) {

  function getUrl() {
    if (mode === 'history') {
      return location.href.replace(location.origin + base, '');
    } else {
      return location.hash.slice(1);
    }
  }

  analysisRoute(getUrl());

  window.addEventListener('popstate', () => {
    analysisRoute(getUrl());
  })

  const { CurrentComp, data } = watchRoutePath(props);

  return <>
    {() => CurrentComp.value ? <CurrentComp.value data={data.value} /> : null}
  </>
}



/**
 * 服务端渲染
 * @param props 
 * @returns 
 */
function StaticRouter(props: StaticRouterProps) {

  let url = ''
  if (mode === 'history') {
    url = props.url.replace(base, '');
  } else {
    const match = props.url.match(/#.*/);
    url = match ? match[0] : '';
  }

  analysisRoute(url);
  const { CurrentComp } = watchRoutePath({ children: props.children, url }, false);

  return <>
    {() => <CurrentComp.value data={props.data} />}
  </>
}

export function Router(props: StaticRouterProps & BrowserRouterProps) {
  return <>{
    isBrowser
      ? <BrowserRouter {...props} />
      : <StaticRouter {...props} />
  }</>
}
