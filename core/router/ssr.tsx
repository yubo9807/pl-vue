import { onMounted, onUnmounted } from '../hooks';
import { isFunction } from '../utils/judge';
import { createElementFragment } from '../vdom/create-element';
import { createHTML } from '../vdom/create-html';
import { h, Fragment } from '../vdom/h';
import { renderToString } from '../vdom/render';
import { Component } from '../vdom/type';
import { config, currentRoute, routeChange } from './create-router';
import { analyzeRoute, findRoute } from './utils';

let currentTemplate = ``;

export function Helmet(props) {

  const regs: RegExp[] = [];
  props.children.forEach(tree => {
    if (tree.tag === 'title') {
      regs.push(new RegExp('<title'));
    } else if (tree.tag === 'meta' && tree.attrs.name) {
      regs.push(new RegExp(`<meta name=("|')?${tree.attrs.name}`));
    }
  });

  // 服务端
  if (currentTemplate) {
    const matched = currentTemplate.match(/\<head\>(.*)\<\/head>/s);
    const headInnerHTML = matched[1].trim();
    const nodes = headInnerHTML.split('\n').filter(val => val.includes('<'));
    for (let i = 0; i < nodes.length; i++) {
      nodes[i] = nodes[i].trim();
      for (let j = 0; j < regs.length; j++) {
        if (regs[j].test(nodes[i])) {
          nodes[i] = '';
        }
      }
    }
    props.children.forEach(val => {
      const html = createHTML(val.tag, val.attrs, val.children);
      nodes.push(html);
    })
    const newHeadInnerHTML = nodes.filter(val => val).join('\n');
    currentTemplate = currentTemplate.replace(/\<head\>.*\<\/head>/s, `<head>\n${newHeadInnerHTML}\n</head>`);
  }

  // #region 客户端
  let backupChild = [];  // 备份原先的字节点
  let count = 0;         // 更换新的节点个数

  onMounted(() => {
    const head = document.head;
    const nodes = head.innerHTML.split('\n').filter(val => val.includes('<'));

    const removes: number[] = [];  // 删除项
    tag: for (let i = 0; i < regs.length; i++) {
      for (let j = i; j < nodes.length; j++) {
        if (regs[i].test(nodes[j])) {
          removes.push(i);
          continue tag;
        }
      }
    }
    removes.forEach(val => {
      backupChild.push(head.children[val].cloneNode(true));
      head.children[val].remove();
    })

    count = props.children.length;
    const node = createElementFragment(props.children);
    head.insertBefore(node, head.children[0]);
  })

  // 恢复原先的节点
  onUnmounted(() => {
    const head = document.head;
    for (let i = 0; i < count; i++) {
      head.children[0].remove();
    }
    backupChild.forEach(node => {
      head.insertBefore(node, head.childNodes[0]);
    })
  })
  // #endregion

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
  if (isFunction(getInitialProps)) {
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
