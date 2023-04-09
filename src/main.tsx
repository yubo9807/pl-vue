import { h, Fragment, render, onUnmounted } from "./vue3";
import style from './module.scss';
import { createRouter, RouterView, RouterLink } from "./vue3/router";
const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: About,
  },
]

function Home() {
  onUnmounted(Home, () => {
    console.log('首页被卸载')
  })
  return <div className={style.demo}>home</div>
}
function About() {
  return <div>about</div>
}

function App() {
  return <>
    <div>My Vue</div>
    <RouterLink to={{ path: '/' }}>首页</RouterLink>
    <RouterLink to={{ path: '/about' }}>关于</RouterLink>
    <RouterView />
  </>
}

// console.log(renderToString(<App />))
const root = document.getElementById('root');
createRouter({
  base: '/dist',
  routes,
})
root.appendChild(render(<App />));
