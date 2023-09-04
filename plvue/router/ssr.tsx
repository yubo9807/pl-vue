import { onMounted } from '../hooks';
import { h, Fragment } from '../vdom/h';
import { renderToString } from '../vdom/render';
import { Component } from '../vdom/type';
import { config, currentRoute, routeChange } from './create-router';
import { analyzeRoute, findRoute } from './utils';

let currentTemplate = ``;

export function Helmet(props) {

  /**
   * 替换 head 中的内容
   * @param headInnerHTML
   * @returns 
   */
  function relpaceTemplate(headInnerHTML: string) {
    const collect: RegExp[] = [];
    const nodes = props.children.map(tree => {
      if (tree.tag === 'title') {
        collect.push(new RegExp('<title'));
      } else if (tree.tag === 'meta' && tree.attrs.name) {
        collect.push(new RegExp(`<meta name=("|')?${tree.attrs.name}`));
      }
      return renderToString(tree);
    });
    const arr = headInnerHTML.split('\n');
  
    const markers: number[] = [];
    tag: for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].trim();
      for (let j = 0; j < collect.length; j++) {
        if (collect[j].test(arr[i])) {
          markers.push(i);
          continue tag;
        }
      }
    }

    arr.push(...nodes);
    const newArr = arr.filter((_, index) => !markers.includes(index));
    return newArr.join('\n');
  }

  // 服务端
  if (currentTemplate) {
    const matched = currentTemplate.match(/\<head\>(.*)\<\/head>/s);
    const newHeadChild = relpaceTemplate(matched[1].trim());
    currentTemplate = currentTemplate.replace(/\<head\>.*\<\/head>/s, `<head>\n${newHeadChild}\n</head>`);
  }

  // 客户端
  onMounted(() => {
    const head = document.head;
    const newHeadChild = relpaceTemplate(head.innerHTML);
    head.innerHTML = newHeadChild;
  })

  return <></>
}

let data = void 0;
let currentUrl = '/';



/**
 * 生成节点前执行组件的 getInitialProps 方法
 * @param url 
 * @returns 
 */
async function execGetInitialProps(url: string) {
  const currentRoute = analyzeRoute(url);
  const find = findRoute(currentRoute.monitor);
  if (!find) return;

  const { getInitialProps } = find.component.prototype;
  if (typeof getInitialProps === 'function') {
    data = await getInitialProps(currentRoute);
    return data;
  }
}

/**
 * 服务端渲染
 * @param props 
 * @returns 
 */
export function StaticRouter() {

  let url = ''
  if (config.mode === 'history') {
    url = currentUrl.replace(config.base, '');
  } else {
    const match = currentUrl.match(/#.*/);
    url = match ? match[0] : '';
  }

  routeChange(url);

  const find = findRoute(currentRoute.monitor);
  return <>{find && <find.component data={data} />}</>;
}



/**
 * 生成 SSR 页面
 * @param App      根组件
 * @param url      req.url
 * @param template html 模版
 * @returns 
 */
export async function ssrOutlet(App: Component, url: string, template: string) {
  currentTemplate = template;
  currentUrl = url;
  const data = await execGetInitialProps(url);
  const content = renderToString(<App />);
  const index = currentTemplate.search('</body>');
  const script = data === void 0 ? '' : `<script>window.${config.ssrDataKey}=${JSON.stringify(data)}</script>`;
  currentTemplate = currentTemplate.slice(0, index) + script + currentTemplate.slice(index, currentTemplate.length);
  return currentTemplate.replace('<!--ssr-outlet-->', content);
}
