import { Fragment, h } from '../vdom/h';
import { ref } from '../reactivity/ref';
import { watch } from '../reactivity/watch';
import { Component, Tree } from '../vdom/type';
import { isRoute } from './route';
import { currentRoute, getBrowserUrl, config, routeChange } from './use-route';
import { isBrowser } from '../utils/judge';
import { analyzeRoute } from './utils';



interface CompTree extends Tree {
  tag: Function
}

/**
 * 查找匹配的组件
 * @param treeList
 * @param path 
 * @returns 
 */
function findComp(treeList: Tree[], path: string) {
  const qureyTree = treeList.find((tree: Tree) => {
    if (tree.attrs.exact || tree.attrs.exact === void 0) {
      return path === tree.attrs.path;
    } else {
      return (path + '/').startsWith(tree.attrs.path + '/');
    }
  });

  if (qureyTree) {
    return qureyTree.attrs.component;
  } else {
    const lastTree = treeList[treeList.length - 1] as CompTree;
    if (lastTree && isRoute(lastTree.tag) && !lastTree.attrs.path) {
      return lastTree.attrs.component as CompTree;
    }
  }
}


type Props = {
  children?: []
}

interface BrowserRouterProps extends Props {
  Loading?: Component
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
    const comp = findComp(props.children, value);
    if (!comp) return;
    const { getInitialProps } = comp.prototype;
    if (typeof getInitialProps === 'function') {
      if (window[config.ssrDataKey]) {
        data = window[config.ssrDataKey];
        delete window[config.ssrDataKey];
      } else {
        const route = analyzeRoute(value);
        data = await getInitialProps(route);
      }
    }
    currentComp.value = comp;
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

  const Comp = findComp(props.children, url);
  return <Comp />;
}

export function Router(props: StaticRouterProps & BrowserRouterProps) {
  return isBrowser()
    ? <BrowserRouter {...props} />
    : <StaticRouter {...props} />
}
