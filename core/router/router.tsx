import { reactive, ref, toRaw, watch } from "../reactivity";
import { createId, customForEach, deepClone, isBrowser, isFunction, isString } from "../utils";
import { Component, PropsType, h, Fragment, BaseComponent, Children } from "../vdom";
import { beforeEach, config, currentApp, currentRoute, variable } from "./create-router";
import { queryRoute } from "./route";
import { BeforeEnter, PagePropsType } from "./type";
import { replace } from "./use-router";
import { formatUrl } from "./utils";

let backupRoute = void 0;  // 旧的 route 信息
const unwatchs  = [];      // 收集子路由的取消监听事件

type BrowserRouterProps = PropsType<{
  loading?:  BaseComponent
  notFound?: BaseComponent
  prefix?:   string
  children?: Children
}>
function BrowserRouter(props: BrowserRouterProps) {

  const Comp = ref<BaseComponent>(props.loading);
  let attrs: PagePropsType = {};

  function routeChange(path: string) {
    const query = queryRoute(props.children, path);
    if (!query) {
      attrs = {};
      Comp.value = props.notFound;
      return;
    }

    /**
     * 渲染组件
     */
    async function next() {
      // 按需加载组件
      if (!query.component.prototype) {
        query.component = (await query.component()).default;
      }

      // 组件没有发生变化
      if (Comp.value === query.component) return;

      attrs.path = query.path;
      const getInitialProps = isExistGetInitialProps(query.component);
      if (getInitialProps) {
        const ssrData = window[config.ssrDataKey];
        if (ssrData && attrs.path in ssrData) {
          attrs.data = ssrData[attrs.path];
          delete ssrData[attrs.path];
        } else {
          attrs.data = await getInitialProps(deepClone(attrs));
        }
      }
      Comp.value = query.component;
      attrs.meta = query.meta;
      attrs.keepAlive = query.keepAlive;
      currentRoute.meta = query.meta;
    }

    if (query.redirect) {
      replace(query.redirect);
      return;
    }

    function protect(func: BeforeEnter) {
      func(toRaw(currentRoute), backupRoute, () => {
        backupRoute = deepClone(currentRoute);
        path === currentRoute.path ? next() : routeChange(currentRoute.path);
      })
    }

    // 全局守卫
    if (beforeEach) {
      protect(beforeEach);
      return;
    }

    // 独享守卫
    if (query.beforeEnter) {
      protect(query.beforeEnter);
      return;
    }

    backupRoute = deepClone(currentRoute);
    next();
  }

  // const unwatch = watch(() => currentRoute.path, value => {
  //   // 父级组件卸载的时候，需要把嵌套路由的监听器全部取消掉（这里存在性能问题）
  //   if (backupRoute) {
  //     const arr1 = backupRoute.path.split('/'), arr2 = value.split('/');
  //     if (arr1[1] !== arr2[1]) {
  //       customForEach(unwatchs, unwatch => unwatch());
  //     }
  //   }
  //   routeChange(value);
  // }, { immediate: true })
  // props.prefix && unwatchs.push(unwatch);
  watch(() => currentRoute.path, value => {
    routeChange(value);
  }, { immediate: true })

  return <>{() => Comp.value && <Comp.value {...attrs} />}</>;
}



export const stack: string[] = reactive([]);  // 执行栈
function deleteStackItem(id: string) {
  const index = stack.indexOf(id);
  stack.splice(index, 1);
}

let repalceComp: string = null;

type StaticRouterProps = PropsType<{
  notFound?: Component
  children?: Children
}>
function StaticRouter(props: StaticRouterProps) {

  function routeChange(path: string) {
    let query = queryRoute(props.children, path);
    if (!query) return;
    currentRoute.path = query.path;

    function protect(func: BeforeEnter) {
      repalceComp = `b_${createId()}`;
      stack.push(repalceComp);

      func(toRaw(currentRoute), backupRoute, () => {
        backupRoute = deepClone(currentRoute);
        resultReplace(repalceComp, query.component, {
          path: query.path,
          meta: query.meta,
        });
        deleteStackItem(repalceComp);
      })
      return repalceComp;
    }

    // 全局守卫
    if (beforeEach) return protect(beforeEach);

    // 独享守卫
    if (query.beforeEnter) return protect(query.beforeEnter);

    return query;
  }

  let query = routeChange(currentRoute.path);

  if (isString(query)) {
    return <>{query}</>
  }

  if (!query) {
    const Comp = props.notFound;
    return Comp ? <Comp /> : <></>;
  }

  // 重定向
  if (query.redirect) {
    query = routeChange(query.redirect);
  }

  query = query as ReturnType<typeof queryRoute>;
  let Comp = query.component;
  currentRoute.path = query.path;
  currentRoute.meta = query.meta;
  const attrs: PagePropsType = {
    path: query.path,
    meta: query.meta,
    keepAlive: query.keepAlive,
  };

  if (repalceComp) {
    resultReplace(repalceComp, Comp, attrs);
    deleteStackItem(repalceComp);
  }

  const replaceStr = `r_${createId()}`;

  // 如果是异步组件
  if (!Comp.prototype) {
    stack.push(replaceStr);
    Comp().then(async res => {
      Comp = res.default;
      
      // 存在 getInitialProps
      const getInitialProps = isExistGetInitialProps(Comp);
      if (getInitialProps) {
        attrs.data = await getInitialProps(deepClone(attrs));
        variable.ssrData[attrs.path] = attrs.data;
      }

      // 替换结果
      resultReplace(replaceStr, Comp, attrs);
    });
    return <>{replaceStr}</>;
  }

  // 存在 getInitialProps
  const getInitialProps = isExistGetInitialProps(Comp);
  if (getInitialProps) {
    stack.push(replaceStr);
    getInitialProps(deepClone(attrs)).then(res => {
      attrs.data = res;
      variable.ssrData[attrs.path] = res;

      // 替换结果
      resultReplace(replaceStr, Comp, attrs);
    });
    return <>{replaceStr}</>;
  }

  return <Comp {...attrs} />
}

/**
 * BrowserRouter & StaticRouter
 * @param props 
 * @returns 
 */
export function Router(props: BrowserRouterProps & StaticRouterProps) {
  customForEach(props.children, route => {
    const { attrs } = route;
    const { path, component } = attrs;

    // 路由前缀
    if (props.prefix) {
      attrs.path = formatUrl(props.prefix + path);
    }

    // 绑定组件
    route.children = component ? [component] : [];
  })
  return isBrowser()
    ? <BrowserRouter {...props} />
    : <StaticRouter {...props} />
}
Router.prototype.$clone = true;


/**
 * 结果替换
 * @param replaceStr 
 * @param Comp 
 * @param attrs 
 */
function resultReplace(replaceStr: string, Comp: BaseComponent, attrs: PagePropsType) {
  const string = currentApp.renderToString(<Comp {...attrs} />);
  deleteStackItem(replaceStr);
  const newTemplate = variable.currentTemplate.replace(replaceStr, string);
  variable.currentTemplate = newTemplate;
}

/**
 * 是否存在 getInitialProps 属性并且能运行
 * @param Comp 
 * @returns 如果能运行返回 getInitialProps 本身
 */
function isExistGetInitialProps(Comp: BaseComponent) {
  const { getInitialProps } = Comp.prototype;
  if (getInitialProps && isFunction(getInitialProps)) {
    return getInitialProps;
  }
}

