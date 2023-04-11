import { h, Fragment, render, renderToString } from "~/vue";
import { BrowserRouter, HashRouter, Route, Link, StaticRouter } from "~/vue/router";
import Home from '@/pages/home';
import About from '@/pages/about';
import NotFound from "./pages/not-found";
import style from './module.scss';

let isBrowser = false;

function App() {

  const Router = isBrowser ? BrowserRouter : StaticRouter;

  return <>
    <div className={style.header}>
      <Link to='/'>首页</Link>
      <Link to={{ path: '/about' }}>关于</Link>
      <Link to='/404'>notFound</Link>
      <a className={style.github} href="https://github.com/yubo9807/mvvm_vue3" target="_blank">GitHub</a>
    </div>

    <Router url='/'>
      <Route path='/' component={Home} exact={true} />
      <Route path='/about' component={About} />
      <Route component={NotFound} />
    </Router>
  </>
}

if (typeof document === 'object') {
  isBrowser = true;
  const root = document.getElementById('root')
  root.innerHTML = '';
  root.appendChild(render(<App />));
} else {
  global._html = renderToString(<App />);
}