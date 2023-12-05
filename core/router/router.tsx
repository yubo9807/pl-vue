import { reactive, ref, toRaw, watch } from "../reactivity";
import { createId, deepClone, isBrowser, isFunction } from "../utils";
import { Component, PropsType, h, Fragment, renderToString } from "../vdom";
import { beforeEach, config, currentRoute, variable } from "./create-router";
import { queryRoute } from "./route";
import { PagePropsType } from "./type";
import { formatUrl } from "./utils";

let backupRoute = void 0;  // 旧的 route 信息
const unwatchs  = [];      // 收集子路由的取消监听事件

type BrowserRouterProps = PropsType<{
  loading?:  Component
  notFound?: Component
  prefix?:   string
}>
function BrowserRouter(props: BrowserRouterProps) {

  const Comp = ref<Component>();
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
    }

    // 全局守卫
    if (beforeEach) {
      beforeEach(toRaw(currentRoute), backupRoute, () => {
        backupRoute = deepClone(currentRoute);
        path === currentRoute.path ? next() : routeChange(currentRoute.path);
      })
      return;
    }

    // 独享守卫
    if (query.beforeEnter) {
      query.beforeEnter(toRaw(currentRoute), backupRoute, () => {
        backupRoute = deepClone(currentRoute);
        path === currentRoute.path ? next() : routeChange(currentRoute.path);
      });
      return;
    }

    backupRoute = deepClone(currentRoute);
    next();
  }

  const unwatch = watch(() => currentRoute.path, value => {
    // 父级组件卸载的时候，需要把嵌套路由的监听器全部取消掉（这里存在性能问题）
    if (backupRoute) {
      const arr1 = backupRoute.path.split('/'), arr2 = value.split('/');
      if (arr1[1] !== arr2[1]) {
        unwatchs.forEach(unwatch => unwatch());
      }
    }
    routeChange(value);
  }, { immediate: true })
  props.prefix && unwatchs.push(unwatch);

  return <>{() => <Comp.value {...attrs} />}</>;
}



export const stack: string[] = reactive([]);  // 执行栈

type StaticRouterProps = PropsType<{
  notFound?: Component
}>
function StaticRouter(props: StaticRouterProps) {
  const query = queryRoute(props.children, currentRoute.path);
  if (!query) {
    const Comp = props.notFound;
    return Comp ? <Comp /> : <></>;
  }

  let lock = false;
  if (query.beforeEnter) {
    lock = true;
    query.beforeEnter(toRaw(currentRoute), backupRoute, () => {
      backupRoute = deepClone(currentRoute);
      lock = false;
    })
  }
  if (lock) return <></>

  let Comp = query.component;
  const attrs: PagePropsType = {
    path: query.path,
  };
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
  if (props.prefix) {
    props.children.forEach(val => {
      val.attrs.path = formatUrl(props.prefix + val.attrs.path);
    })
  }
  return isBrowser()
    ? <BrowserRouter {...props} />
    : <StaticRouter {...props} />
}

/**
 * 结果替换
 * @param replaceStr 
 * @param Comp 
 * @param attrs 
 */
function resultReplace(replaceStr: string, Comp: Component, attrs: PagePropsType) {
  const string = renderToString(<Comp {...attrs} />);
  const index = stack.indexOf(replaceStr);
  stack.splice(index, 1);
  const newTemplate = variable.currentTemplate.replace(replaceStr, string);
  variable.currentTemplate = newTemplate;
}

/**
 * 是否存在 getInitialProps 属性并且能运行
 * @param Comp 
 * @returns 如果能运行返回 getInitialProps 本身
 */
function isExistGetInitialProps(Comp: Component) {
  const { getInitialProps } = Comp.prototype;
  if (getInitialProps && isFunction(getInitialProps)) {
    return getInitialProps;
  }
}

