import { h, onUnmounted } from "~/core";
import { Route, Router, Link } from "~/core/router";

function App() {
  return <div>
    <nav>
      <Link to='/'>home</Link>
      <Link to='/about'>about</Link>
    </nav>
    <Router>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} exact={false} />
    </Router>
  </div>
}

function Home() {
  return <div>
    home
  </div>
}
function About() {
  console.log('about')
  onUnmounted(() => {
    console.log('about unmount')
  })
  return <div>
    about
    <nav>
      <Link to='/about/aaa'>aaa</Link>
      <Link to='/about/aab'>aab</Link>
      <Link to='/about/bbb'>bbb</Link>
    </nav>
    <Router prefix="/about">
      <Route path="/aaa" component={Aaa} />
      <Route path="/aab" component={Aaa} />
      <Route path="/bbb" component={Bbb} />
    </Router>
  </div>
}

function Aaa() {
  console.log('aaa')
  onUnmounted(() => {
    console.log('aaa unmount')
  })
  return <div>
    aaa
  </div>
}
function Bbb() {
  return <div>
    bbb
  </div>
}

export default App;
