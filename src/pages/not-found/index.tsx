import { h } from "~/plvue";
import style from './style.module.scss';

export default function NotFound() {
  // return <Redirect to="/" />
  return <div className={style['not-found']}>404</div>
}
