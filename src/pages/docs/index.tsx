import style from './style.module.scss';
import './markdown.scss';
import { h, nextTick, onMounted, ref, watch } from "~/plvue";
import { Link, useRoute } from "~/plvue/router";
import { joinClass } from "@/utils/string";
import Layout from '@/components/layout';
import { api_getDocsConfig, api_getDocsContent } from '@/api/docs';

function Docs(props) {

  const list = ref(props.data.list);
  const content = ref(props.data.content);

  const route = useRoute();
  const visible = ref(false);  // 移动端侧边栏是否显示
  const active = ref(getName());
  function getName() {
    const name = route.path.replace(route.monitor, '').slice(1);
    return name || list.value[0] && list.value[0].value;
  }

  // path 发生变化，重新请求文档内容
  const mdRef = ref<HTMLElement>(null);
  onMounted(async () => {
    const unWatch = watch(() => route.path, async value => {
      if (route.monitor !== '/docs') {
        return unWatch();
      }

      // 渲染文档
      active.value = getName();
      content.value = await getContent(active.value);
      visible.value = false;

      // 代码高亮
      nextTick(codeHighlight);      
    });

    import('highlight.js/styles/base16/decaf.css');
    const hljs = (await import('highlight.js/lib/common')).default;

    codeHighlight();
    function codeHighlight() {
      const codeList = mdRef.value.querySelectorAll('pre code');
      codeList.forEach((val: HTMLElement) => {
        hljs.highlightElement(val);
      })
    }
  })

  return <Layout>
    <div className={joinClass('leayer', style.container)}>
      <ul className={() => joinClass(style.side, visible.value ? style.active : '')}>
        {list.value.map(val => <li className={() => active.value === val.value ? style.active : ''}>
          <Link to={`/docs/${val.value}`}>{val.label}</Link>
        </li>)}
      </ul>
      <div ref={mdRef} className={joinClass(style.content, 'markdown')}>
        <div innerHTML={() => content.value}></div>
      </div>
    </div>
    <div className={() => joinClass(style.showSide, visible.value ? style.active : '')} onclick={() => visible.value = !visible.value}></div>
  </Layout>
}

Docs.prototype.getInitialProps = async (route) => {
  const list = await getCatalogue();
  const content = await getContent(route.path.replace(route.monitor, '') || list[0] && list[0].value);
  return {
    list,
    content,
  };
}

export default Docs;

/**
 * 获取文档目录
 * @returns 
 */
async function getCatalogue() {
  const [err, res] = await api_getDocsConfig();
  const list = [];
  if (err) return list;

  const obj = JSON.parse(res.data.content);
  for (const key in obj) {
    list.push({ label: obj[key], value: key });
  }
  return list;
}

/**
 * 获取文档内容
 * @param name 
 * @returns 
 */
async function getContent(name: string) {
  const [err, res] = await api_getDocsContent(`/plvue/${name}.md`)
  if (err) return '';
  return res.data.content;
}
