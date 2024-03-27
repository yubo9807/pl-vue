import { watch } from '../reactivity';
import { customForEach, len } from '../utils';
import { Fragment, h, onMounted, onUnmounted } from '../vdom';
import { config, currentApp, setCurrentRoute, variable } from './create-router';
import { stack } from './router';
import { analyzeRoute } from './utils';

export function Helmet(props) {

  const regs: RegExp[] = [];
  customForEach(props.children, tree => {
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
    for (let i = 0; i < len(nodes); i++) {
      nodes[i] = nodes[i].trim();
      for (let j = 0; j < len(regs); j++) {
        if (regs[j].test(nodes[i])) {
          nodes[i] = '';
        }
      }
    }
    customForEach(props.children, val => {
      const html = currentApp.createHTML(val);
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
    tag: for (let i = 0; i < len(regs); i++) {
      for (let j = i; j < len(nodes); j++) {
        if (regs[i].test(nodes[j])) {
          removes.push(i);
          continue tag;
        }
      }
    }
    customForEach(removes, val => {
      backupChild.push(head.children[val].cloneNode(true));
      head.children[val].remove();
    })

    count = len(props.children);
    const node = currentApp.createNodeFragment(props.children);
    head.insertBefore(node, head.children[0]);
  })

  // 恢复原先的节点
  onUnmounted(() => {
    const head = document.head;
    for (let i = 0; i < count; i++) {
      head.children[0].remove();
    }
    customForEach(backupChild, node => {
      head.insertBefore(node, head.childNodes[0]);
    })
  })
  // #endregion

  return h(Fragment, null);
}

/**
 * 生成 SSR 页面
 * @param App      根组件
 * @param url      req.url
 * @param template html 模版
 * @returns 
 */
export async function ssrOutlet(content: string, url: string, template: string) {
  return new Promise((resolve) => {
    url = url.replace(config.base, '');
    if (config.mode === 'hash') {
      const matchd = url.match(/#(.*)/);
      url = matchd ? matchd[1] : '';
    }
    setCurrentRoute(analyzeRoute(url));
    variable.ssrData = {};

    variable.currentTemplate = template.replace('<!--ssr-outlet-->', content);

    const unWatch = watch(() => len(stack), value => {
      if (value === 0) {
        const newTemplate = variable.currentTemplate;
        const index = newTemplate.search('</body>');
        const script = len(Object.keys(variable.ssrData)) > 0 ? `<script>window.${config.ssrDataKey}=${JSON.stringify(variable.ssrData)}</script>` : '';
        variable.currentTemplate = newTemplate.slice(0, index) + script + newTemplate.slice(index, len(newTemplate));
        resolve(variable.currentTemplate);
        unWatch();
      }
    }, { immediate: true })
  })
}
