import { h } from "~/vue";
import * as vue from '~/vue';
import * as router from '~/vue/router';
import style from './module.scss';

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
