import { Fragment, h, ref } from "~/core"
import { Link, PagePropsType, Route, Router } from "~/core/router"

function App() {
  return <>
    <nav>
      <Link to='/'>home</Link>
      <Link to='/about'>about</Link>
      <Link to='/child'>child</Link>
      <Link to='/redirect'>redirect</Link>
    </nav>
    <Router notFound={NotFound}>
      <Route path="/" component={Home} keepAlive={true} />
      <Route path="/about" component={About} beforeEnter={(to, from, next) => {
        console.log(to);
        next();
      }} />
      <Route path="/child" component={Child} exact={false} />
      <Route path="/redirect" redirect="/about" />
    </Router>
  </>
}

function Home() {
  const count = ref(0);
  return <div>
    <h2>{() => count.value}</h2>
    <button onclick={() => count.value++}>++</button>
  </div>
}

function About() {
  return <div>About</div>
}

function NotFound() {
  return <div>404</div>
}

function Child(props: PagePropsType) {
  return <div>
    Child
    <nav>
      <Link to='/child/aaa'>aaa</Link>
      <Link to='/child/bbb'>bbb</Link>
    </nav>
    <Router prefix={props.path}>
      <Route path="" redirect={`${props.path}/aaa`} />
      <Route path='/aaa' component={Aaa} />
      <Route path='/bbb' component={Bbb} />
    </Router>
  </div>
}

function Aaa() {
  return <div>Aaa</div>
}

function Bbb() {
  return <div>Bbb</div>
}

export default App;
