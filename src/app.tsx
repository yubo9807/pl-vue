import './styles/index.scss';
import { h, Fragment } from "~/plvue";
import { Router, Route, initRouter } from "~/plvue/router";
import Home from '@/pages/home';
import Docs from '@/pages/docs';
import DocsUse from '@/pages/docs/use';
import DocsRealize from '@/pages/docs/realize';
import NotFound from "./pages/not-found";
import env from '~/config/env';
import Layout from './layout';

export const routes = [
  {
    path: '/',
    component: Layout,
    exact: false,
    routes: [
      { path: '/', component: Home, },
      { path: '/docs', component: Docs, exact: false,
        routes: [
          { path: '/docs/use', component: DocsUse, },
          { path: '/docs/realize', component: DocsRealize, },
        ]
      },
    ],
  },
  {
    component: NotFound,
  },
]

type Props = {
  isBrowser: boolean  // 是否为浏览器环境
  url?:      string   // 服务端渲染请求路径
  data?:     any      // 渲染之前数据（getInitialProps）
}
function App(props: Props) {

  initRouter({
    base: env.BASE_URL,
    mode: 'history',
    isBrowser: props.isBrowser,
  })

  return <Router url={props.url} data={props.data}>
    {...routeRecursion(routes)}
  </Router>
}

function routeRecursion(routes) {
  return routes ? routes.map(val => {
    const { routes: childRoutes, ...args } = val;
    return <Route {...args}>
      {...routeRecursion(childRoutes)}
    </Route>
  }) : []
}

export default App;
