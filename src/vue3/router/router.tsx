import { ref } from '../reactivity/ref';
import { watch } from '../reactivity/watch';
import { nextTick } from '../utils/next-tick';
import { Fragment, h } from '../vdom/h';
import { Tree } from '../vdom/type';
import { isComponent } from '../vdom/utils';
import { currentRoute, analysisRoute, base, setMode } from './use-history';

type Props = {
  children?: []
}

/**
 * 监听路由变化
 * @param props 
 * @returns 
 */
function watchRoutePath(props: Props) {
  const CurrentComp = ref(null);

  watch(() => currentRoute.path, value => {
    const routes = props.children;
    const tree: Tree = routes.find((tree: Tree) => {
      if (tree.attrs.exact) {
        return value === tree.attrs.path;
      } else {
        return ((value as string) + '/').startsWith(tree.attrs.path + '/');
      }
    });
    if (tree) {
      nextTick(() => {  // 等待组件创建完 id
        CurrentComp.value = tree.attrs.component;
      })
    } else {
      const tree: Tree = routes[routes.length - 1];
      if (isComponent(tree.tag) && !tree.attrs.path) {
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
export function BrowserRouter(props: Props) {

  setMode('history');

  function getUrl() {
    return location.href.replace(base, '');
  }

  analysisRoute(getUrl());
  window.addEventListener('popstate', () => {
    analysisRoute(getUrl());
  })

  const { CurrentComp } = watchRoutePath(props);

  return <>
    {() => <CurrentComp.value />}
  </>
}



/**
 * hash 模式路由
 * @param props 
 * @returns 
 */
export function HashRouter(props: Props) {

  setMode('hash')

  function getUrl() {
    return location.origin + location.hash.slice(1);
  }

  analysisRoute(getUrl());
  window.addEventListener('hashchange', () => {
    analysisRoute(getUrl());
  })

  const { CurrentComp } = watchRoutePath(props);

  return <>
    {() => CurrentComp.value ? <CurrentComp.value /> : null}
  </>
}
