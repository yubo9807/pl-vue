import { watch } from '../reactivity';
import { createElementFragment, createHTML, h, Fragment, renderToString, Component, onMounted, onUnmounted } from '../vdom';
import { config, setCurrentRoute, variable } from './create-router';
import { stack } from './router';
import { analyzeRoute } from './utils';

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
  if (variable.currentTemplate) {
    const matched = variable.currentTemplate.match(/\<head\>(.*)\<\/head>/s);
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
    variable.currentTemplate = variable.currentTemplate.replace(/\<head\>.*\<\/head>/s, `<head>\n${newHeadInnerHTML}\n</head>`);
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

/**
 * 生成 SSR 页面
 * @param App      根组件
 * @param url      req.url
 * @param template html 模版
 * @returns 
 */
export async function ssrOutlet(App: Component, url: string, template: string) {
  return new Promise((resolve) => {
    url = url.replace(config.base, '');
    if (config.mode === 'hash') {
      const matchd = url.match(/#(.*)/);
      url = matchd ? matchd[1] : '';
    }
    setCurrentRoute(analyzeRoute(url));
    variable.ssrData = {};

    const content = renderToString(<App />);
    variable.currentTemplate = template.replace('<!--ssr-outlet-->', content);

    const unWatch = watch(() => stack.length, value => {
      if (value === 0) {
        const newTemplate = variable.currentTemplate;
        const index = newTemplate.search('</body>');
        const script = Object.keys(variable.ssrData).length > 0 ? `<script>window.${config.ssrDataKey}=${JSON.stringify(variable.ssrData)}</script>` : '';
        variable.currentTemplate = newTemplate.slice(0, index) + script + newTemplate.slice(index, newTemplate.length);
        resolve(variable.currentTemplate);
        unWatch();
      }
    }, { immediate: true })
  })
}
