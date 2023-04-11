import { h, Fragment } from "~/vue";
import { BrowserRouter, HashRouter, Route, Link, StaticRouter } from "~/vue/router";
import Home from '@/pages/home';
import About from '@/pages/about';
import NotFound from "./pages/not-found";
import style from './module.scss';


type Props = {
  isBrowser: boolean
  url?:      string
}
function App(props: Props) {

  const Router = props.isBrowser ? BrowserRouter : StaticRouter;

  return <>
    <nav className={style.header}>
      <Link to='/'>首页</Link>
      <Link to={{ path: '/about' }}>关于</Link>
      <Link to='/404'>notFound</Link>
      <a className={style.github} href="https://github.com/yubo9807/mvvm_vue3" target="_blank">GitHub</a>
    </nav>
    123

    <Router url={props.url}>
      <Route path='/' component={Home} exact={true} />
      <Route path='/about' component={About} />
      <Route component={NotFound} />
    </Router>
  </>
}

export default App;
