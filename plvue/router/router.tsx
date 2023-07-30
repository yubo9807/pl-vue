import { reactive } from '../reactivity/reactive';
import { watch } from '../reactivity/watch';
import { isObject } from '../utils/judge';
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



let isFirstRender = true;  // 是否为第一次渲染
/**
 * 监听路由变化
 * @param props 
 * @returns 
 */
function watchRoutePath(props: StaticRouterProps & BrowserRouterProps, isBrowser = true) {
  const currentTree: Tree = reactive({
    tag: '',
    attrs: {},
    children: [],
  });

  watch(() => currentRoute.path, async value => {
    const routes = props.children.filter((tree: Tree) =>
      isObject(tree) && isRoute(tree.tag as Function));

    const tree = findTree(routes, value);
    if (!tree) return;

    if (isBrowser && typeof tree.tag.prototype.getInitialProps === 'function') {
      let data = void 0;
      if (isFirstRender && window[ssrDataKey]) {
        data = window[ssrDataKey];
        delete window[ssrDataKey];
        isFirstRender = false;
      } else {
        if (props.Loading) currentTree.tag = props.Loading;
        // await executeTreeMethods(tree);
      }
    }
    for (const prop in tree) {
      currentTree[prop] = tree[prop];
    }
  }, { immediate: true })

  return {
    currentTree,
  }
}

/**
 * 执行组件树上的 getInitialProps，并将结果赋值在 props 中
 * @param tree 
 */
async function executeTreeMethods(tree: CompTree) {
  const func = tree.tag.prototype.getInitialProps;
  if (typeof func === 'function') {
    tree.attrs.data = await func();
  }
  if (tree.children.length > 0) {
    await executeTreeMethods(tree.children[0]);
  }
}

/**
 * 递归渲染组建树
 * @param props 
 * @returns 
 */
function tier(compTree: () => CompTree) {
  const tree = compTree();
  const Comp = tree.tag;
  return <>{() => <Comp>
    {tree.children[0] && tier(() => tree.children[0])}
  </Comp>}</>
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

  const { currentTree } = watchRoutePath(props);

  return tier(() => currentTree as CompTree);

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
  const { currentTree } = watchRoutePath({ children: props.children, url }, false);

  return <tier tree={() => currentTree as CompTree} />
}

export function Router(props: StaticRouterProps & BrowserRouterProps) {
  return <>{
    isBrowser
      ? <BrowserRouter {...props} />
      : <StaticRouter {...props} />
  }</>
}
