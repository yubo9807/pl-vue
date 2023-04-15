import { ref } from '../reactivity/ref';
import { watch } from '../reactivity/watch';
import { nextTick } from '../utils/next-tick';
import { Fragment, h } from '../vdom/h';
import { Tree } from '../vdom/type';
import { base, isBrowser, mode } from './init-router';
import { isRoute } from './route';
import { analysisRoute, currentRoute } from './use-route';

type Props = {
  children?: []
}

/**
 * 监听路由变化
 * @param props 
 * @returns 
 */
function watchRoutePath(props: StaticRouterProps, isBrowser = true) {
  const CurrentComp = ref(null);

  watch(() => currentRoute.path, value => {
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
      isBrowser
        ? nextTick(() => CurrentComp.value = tree.attrs.component)  // 等待组件创建完 id
        : CurrentComp.value = tree.attrs.component;
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
  }
}



/**
 * history 模式路由
 * @param props 
 * @returns 
 */
function BrowserRouter(props: Props) {

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

  const { CurrentComp } = watchRoutePath(props);

  return <>
    {() => CurrentComp.value ? <CurrentComp.value /> : null}
  </>
}


interface StaticRouterProps extends Props {
  url?: string
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
    {() => <CurrentComp.value />}
  </>
}

export function Router(props: StaticRouterProps) {
  return <>{
    isBrowser
      ? <BrowserRouter children={props.children} />
      : <StaticRouter {...props} />
  }</>
}
