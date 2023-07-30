import { h, Fragment } from "~/plvue";
import style from './style.module.scss';
export default function() {
  return <footer className={style.footer}>
    <strong>⚠️ 注意事项</strong>
    <p>本文文档仅供学习参考。并未发布正式版本，不提供任何商业用途。</p>
  </footer>
}