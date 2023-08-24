import './styles/index.scss';
import { h } from "~/plvue";
import { Router, createRouter } from "~/plvue/router";
import env from '~/config/env';
import Home from './pages/home';
import Docs from './pages/docs';
import NotFound from "./pages/not-found";

const router = createRouter({
  base: env.BASE_URL,
  mode: 'history',
  routes: [
    { path: '/', component: Home, },
    { path: '/docs', component: Docs, exact: false, },
    { component: NotFound, },
  ]
});


type Props = {
  url?:  string  // 服务端渲染请求路径
  data?: any     // 渲染前数据（getInitialProps）
}
function App(props: Props) {
  return <Router url={props.url} data={props.data} />
}

export default App;
