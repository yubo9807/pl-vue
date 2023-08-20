import style from './style.module.scss';
import { h } from "~/plvue"
import { Link, useRoute } from "~/plvue/router"
import { joinClass } from "@/utils/string";
import Layout from '@/components/layout';

export default function Docs(props) {
  const route = useRoute();
  console.log(route)
  return <Layout>
    <div className={joinClass('leayer', style.container)}>
      <ul className={style.side}>
        <li>
          <Link to='/docs/intro'>简介</Link>
        </li>
        <li>
          <Link to='/docs/use'>使用</Link>
        </li>
        <li>
          <Link to='/docs/realize'>实现</Link>
        </li>
      </ul>
      <div className={style.content}>
      </div>
    </div>
  </Layout>
}
