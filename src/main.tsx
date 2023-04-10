import { h, Fragment, render } from "./vue3";
import { HashRouter, Route, Link } from "./vue3/router";
import Home from '@/pages/home';
import About from '@/pages/about';
import NotFound from "./pages/not-found";
import style from './module.scss';

function App() {
  return <>
    <div className={style.header}>
      <Link to='/'>首页</Link>
      <Link to='/about'>关于</Link>
      <Link to='/404'>notFound</Link>
      <a className={style.github} href="https://github.com/yubo9807/mvvm_vue3" target="_blank">GitHub</a>
    </div>

    <HashRouter>
      <Route path='/' component={Home} exact={true} />
      <Route path='/about' component={About} />
      <Route component={NotFound} />
    </HashRouter>
  </>
}

document.getElementById('root').appendChild(render(<App />));
