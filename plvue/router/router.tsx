import { watch } from '../reactivity/watch';
import { ref } from '../simple';
import { objectAssign } from '../utils/object';
import { Fragment, h } from '../vdom/h';
import { Component, Tree } from '../vdom/type';
import { base, isBrowser, mode, ssrDataKey } from './init-router';
import { isRoute } from './route';
import { analysisRoute, currentRoute } from './use-route';
import { formatPath } from './utils';

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

interface CompTree extends Tree {
  tag: Function
}

const collect: CompTree[] = [];
/**
 * 查找匹配的组件树
 * @param treeList
 * @param path 
 * @returns 
 */
function findTree(treeList: Tree[], path: string) {
  const qureyTree = treeList.find((tree: Tree) => {
    if (tree.attrs.exact || tree.attrs.exact === void 0) {
      return path === tree.attrs.path;
    } else {
      return (path + '/').startsWith(formatPath(tree.attrs.path + '/'));
    }
  });
  if (!qureyTree) return null;

  const tree: Tree = { tag: '', attrs: {}, children: [] }
  tree.tag = qureyTree.attrs.component;
  collect.push({
    tag: qureyTree.attrs.component,
    children: [],
    attrs: [],
  })
  const children = [findTree(qureyTree.children, path)].filter(val => val);
  tree.children = children;
  if (children.length === 0) {
    const lastTree = qureyTree.children[qureyTree.children.length - 1];
    if (lastTree && isRoute(lastTree.tag) && !lastTree.attrs.path) {
      tree.children = [objectAssign(tree, { tag: lastTree.attrs.component })];
    }
  }

  if (qureyTree.attrs.exact === false && tree.children.length === 0) {
    const lastTree = treeList[treeList.length - 1] as CompTree;
    if (lastTree && isRoute(lastTree.tag) && !lastTree.attrs.path) {
      tree.tag = lastTree.attrs.component;
      return tree as CompTree;
    }
  }

  return tree as CompTree;
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

  const pageList = ref([]);
  watch(() => currentRoute.path, value => {
    collect.length = 0;
    findTree(props.children, currentRoute.path);
    pageList.value = collect;
  }, { immediate: true })

  return <>{recursionPage(pageList.value)}</>;

}

function recursionPage(treeList: CompTree[], index: number = 0) {
  return () => {
    const tree = treeList[index];
    if (!tree) return null;
    return <tree.tag>
      {recursionPage(treeList, index+1)}
    </tree.tag>
  }
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
  
  return <div>111</div>
}

export function Router(props: StaticRouterProps & BrowserRouterProps) {
  return <>{
    isBrowser
      ? <BrowserRouter {...props} />
      : <StaticRouter {...props} />
  }</>
}
