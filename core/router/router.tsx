import { reactive, ref, toRaw, watch } from "../reactivity";
import { createId, deepClone, isBrowser, isFunction } from "../utils";
import { Component, PropsType, h, Fragment, renderToString } from "../vdom";
import { config, currentRoute, variable } from "./create-router";
import { queryRoute } from "./route";

export type PagePropsType = {
  path?: string
  data?: any
}

let backup = void 0;

type BrowserRouterProps = PropsType<{
  loading?:  Component
  notFound?: Component
}>
export function BrowserRouter(props: BrowserRouterProps) {

  const Comp = ref<Component>();
  let attrs: PagePropsType = {};

  watch(() => currentRoute.path, value => {
    const query = queryRoute(props.children, value);
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
      attrs.path = query.path;
      const getInitialProps = isExistGetInitialProps(query.component);
      if (getInitialProps) {
        const ssrData = window[config.ssrDataKey];
        if (ssrData) {
          attrs.data = ssrData[attrs.path];
          delete ssrData[attrs.path];
        } else {
          attrs.data = await getInitialProps(deepClone(attrs));
        }
      }
      Comp.value = query.component;
    }

    if (query.beforeEnter) {
      query.beforeEnter(toRaw(currentRoute), backup, () => {
        backup = deepClone(currentRoute);
        next();
      });
    } else {
      next();
    }

  }, { immediate: true })

  return <>{() => <Comp.value {...attrs} />}</>;
}

export const stack: string[] = reactive([]);  // 执行栈

type StaticRouterProps = PropsType<{
  notFound?: Component
}>
export function StaticRouter(props: StaticRouterProps) {
  const query = queryRoute(props.children, currentRoute.path);
  if (!query) {
    const Comp = props.notFound;
    return Comp ? <Comp /> : <></>;
  }

  let lock = false;
  if (query.beforeEnter) {
    lock = true;
    query.beforeEnter(toRaw(currentRoute), backup, () => {
      backup = deepClone(currentRoute);
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

