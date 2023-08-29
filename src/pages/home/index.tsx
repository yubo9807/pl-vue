import style from './style.module.scss';
import { h } from "~/plvue";
import Layout from '@/components/layout';
import { joinClass } from "@/utils/string";
import env from "~/config/env";
import { Link } from '~/plvue/router';

function Home() {

  return <Layout>
    <div className={style.banner}>
      <div className={style.box}>
        <div className={style.bg}>
          <strong>Pl Vue</strong>
          <p>一个 JS 库，只关心数据与函数之间的联动</p>
        </div>
        <Link className={style.btn} to='/docs/reactivity'>API 参考</Link>
      </div>
    </div>

    <article className={joinClass('leayer', 'module-gap', style.article)}>
      <p className={style.paragraph}>
        一个轻量级、不依赖任何第三方库的 JS 数据响应式库，除响应式 API 外，该库还提供了组件化、挂载钩子、Router、Store 以及服务端渲染相关 API，项目搭建可参考 
        &nbsp;<a href={env.GITHUB_URL+'mvvm_vue3'}>GitHub</a>
        。
      </p>
      <p className={style.mark}>该库本身与 Vue 框架无任何关系，只是多数 API 在命名上相同而已。</p>
    </article>

    <ul className={joinClass('leayer', 'module-gap', style.peculiarity)}>
      <li>
        <h2>响不响应式的，高度交予开发者决定</h2>
        <p>
          JSX 编程方式，响应式数据统一使用函数的方式包裹。
          <Link to='/docs/intro'>了解更多</Link>
        </p>
      </li>
      <li>
        <h2>无虚拟 DOM 参与</h2>
        <p>将用到响应式数据的函数进行收集，在数据更新后执行相应的函数。因此直接省去了虚拟 DOM 的比较。</p>
      </li>
      <li>
        <h2>拿来就用，灵活多变</h2>
        <p>
          无需脚手架，原生应用亦可构建。
          <a href={env.GITHUB_URL+'single-page'} target="_blank">代码示例</a>
        </p>
      </li>
      <li>
        <h2>代码精简，minify &lt; 10k</h2>
        <p>手写 h 与 Fragment，将代码体积精简到极致。</p>
      </li>

    </ul>
  </Layout>
}

Home.prototype.getInitialProps = async () => {
  return 'home'
}

export default Home;
