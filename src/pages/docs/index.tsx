import style from './style.module.scss';
import { h, onMounted, ref, watch } from "~/plvue"
import { Link, useRoute } from "~/plvue/router"
import { joinClass } from "@/utils/string";
import Layout from '@/components/layout';
import { api_getDocsConfig, api_getDocsContent } from '@/api/docs';

function Docs(props) {

  const list = ref(props.data.list);
  const content = ref(props.data.content);

  onMounted(() => {
    const route = useRoute();
    watch(() => route.path, async value => {
      content.value = await getContent(value.replace(route.monitor, ''));
    }, { deep: true });
  })

  return <Layout>
    <div className={joinClass('leayer', style.container)}>
      <ul className={style.side}>
        {list.value.map(val => <li>
          <Link to={`/docs/${val.value}`}>{val.label}</Link>
        </li>)}
      </ul>
      <div className={style.content}>
        <div innerHTML={() => content.value}></div>
      </div>
    </div>
  </Layout>
}

Docs.prototype.getInitialProps = async (route) => {
  const { name } = route.query;
  const list = await getCatalogue();
  const content = await getContent(name || list[0] && list[0].value);
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
