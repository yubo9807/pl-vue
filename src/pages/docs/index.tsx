import style from './style.module.scss';
import { h } from "~/plvue"
import Layout from '@/components/layout';
import { Link } from "~/plvue/router"
import { joinClass } from "@/utils/string";

export default function Docs(props) {
  return <Layout>
    <div className={joinClass('leayer', style.container)}>
      <ul className={style.side}>
        <li>
          <Link to='/docs/use'>使用</Link>
        </li>
        <li>
          <Link to='/docs/realize'>实现</Link>
        </li>
      </ul>
      <div className={style.content}>
        {props.children}
      </div>
    </div>
  </Layout>
}
