import { h } from "@/vue3";
import style from './module.scss';

export default function NotFound() {
  // return <Redirect to="/" />
  return <div className={style['not-found']}>404</div>
}
