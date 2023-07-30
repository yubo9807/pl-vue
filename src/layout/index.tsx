import Header from "./components/header";
import Footer from "./components/footer";
import { h, Fragment } from "~/plvue";
import style from './style.module.scss';

export default function Layout(props) {
  return <div>
    <Header />
    <main className={style.main}>
      {props.children}
    </main>
    <Footer />
  </div>
}

Layout.prototype.getInitialProps = async () => {
  console.log('loyout')
  return 'loyout'
}