import { h, Fragment } from "~/vue";
import { Router, Route, Link, createRouter } from "~/vue/router";
import Home from '@/pages/home';
import About from '@/pages/about';
import NotFound from "./pages/not-found";
import style from './module.scss';

export const base = '/dist';

export const routes = [
  { path: '/', component: Home, exact: true },
  { path: '/about', component: About },
  { component: NotFound },
]

type Props = {
  isBrowser: boolean  // 是否为浏览器环境
  url?:      string   // 服务端渲染请求路径
  data?:     any      // 渲染之前数据（getInitialProps）
}
function App(props: Props) {

  createRouter({
    base,
    mode: 'hash',
    isBrowser: props.isBrowser,
  })

  return <>
    <nav className={style.header}>
      <Link to='/'>首页</Link>
      <Link to='/about'>关于</Link>
      <Link to='/404'>notFound</Link>
      <a className={style.github} href="https://github.com/yubo9807/mvvm_vue3" target="_blank">GitHub</a>
    </nav>

    <Router url={props.url} data={props.data}>
      {...routes.map(item => <Route {...item} />)}
    </Router>
  </>
}

export default App;
