import { h } from "~/pvue";
import * as vue from '~/pvue';
import * as router from '~/pvue/router';
import style from './style.module.scss';

export default function About() {
  return <div className={style['page-about']}>
    <p>自个儿手写的 Vue 响应式源码，实现个大概！</p>
    <strong>Vue API</strong>
    <p>
      {Object.keys(vue).join('、')}
    </p>
    <strong>Router API</strong>
    <p>
    {Object.keys(router).join('、')}
    </p>
  </div>
}