import style from './style.module.scss';
import { h, Fragment } from "~/plvue";
import Header from "./header";
import Footer from "./footer";

export default function Layout(props) {
  return <div>
    <Header />
    <main className={style.main}>
      {props.children}
    </main>
    <Footer />
  </div>
}
