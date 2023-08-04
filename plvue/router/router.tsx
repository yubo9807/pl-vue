import { Fragment, h } from '../vdom/h';
import { ref } from '../reactivity/ref';
import { toRaw } from '../reactivity/reactive';
import { watch } from '../reactivity/watch';
import { removeDependency } from '../reactivity/depend';
import { objectAssign } from '../utils/object';
import { Component, Tree } from '../vdom/type';
import { base, isBrowser, mode, ssrDataKey } from './init-router';
import { isRoute } from './route';
import { analysisRoute, currentRoute } from './use-route';
import { formatPath } from './utils';

type Props = {
  children?: []
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

/**
 * 扁平化组件树
 * @param tree 
 * @param collect 
 * @returns 
 */
function flatteningTree(tree: CompTree, collect: CompTree[] = []) {
  const { tag, attrs, children } = tree;
  collect.push({ tag, attrs, children: [] });
  if (children.length > 0) {
    flatteningTree(children[0], collect);
  }
  return collect;
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

  const getUrl = (function() {
    if (mode === 'history') {
      return () => location.href.replace(location.origin + base, '');
    } else {
      return () => location.hash.slice(1);
    }
  }())

  analysisRoute(getUrl());
  window.addEventListener('popstate', () => {
    analysisRoute(getUrl());
  })

  const treeList = ref([]);
  watch(() => currentRoute.path, value => {
    const tree = findTree(props.children, value);
    treeList.value = flatteningTree(tree);
  }, { immediate: true })

  const oldTreeList = new Array();  // 收集旧的响应式对象
  /**
   * 递归渲染页面组件
   * @param index 
   * @returns 
   */
  function recursionPage(index: number = 0) {
    return () => {
      const tree = treeList.value[index];
      if (!tree) {
        delete oldTreeList[index];
        return null;
      }

      const rawTree = toRaw(tree);

      // 从第二层开始，组件被卸载后，清除旧组件的自动更新。防止重复渲染
      if (index > 0 && oldTreeList[index] && !rawTree.tag) {
        removeDependency(oldTreeList[index]);
      }

      // 保存数据，方便后续清除响应式依赖
      oldTreeList[index] = rawTree;

      // 递归渲染组件
      return <tree.tag>{recursionPage(index+1)}</tree.tag>
    }
  }

  return <>{recursionPage()}</>;

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
  if (mode === 'history') {
    url = props.url.replace(base, '');
  } else {
    const match = props.url.match(/#.*/);
    url = match ? match[0] : '';
  }

  analysisRoute(url);

  const tree = findTree(props.children, url);
  return <tree.tag children={tree.children} />;
}

export function Router(props: StaticRouterProps & BrowserRouterProps) {
  return isBrowser
    ? <BrowserRouter {...props} />
    : <StaticRouter {...props} />
}
