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


function App() {
  return <Router />
}

export default App;
