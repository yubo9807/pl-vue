# Pl Vue

一个用来搭建用户界面的微型前端框架，也可作为第三方库使用。更多详情请前往 [Pl Vue 文档](http://plvue.hpyyb.cn/) 。

> 该库不依赖于任何其他库，与 Vue 没有任何关系，只是在 API 命名上大多数一致。

## Install

`npm install pl-vue`

## Use

```tsx
import { h, ref, render } from 'pl-vue';

function App() {
  const count = ref(0);

  return <div>
    {/* 响应式数据一律以函数形式返回 */}
    <h1>{() => count.value}</h1>
    <button onclick={() => count.value++}>click</button>
  </div>
}

const root = document.getElementById('root');
root.appendChild(render(<App />));
```

## Template

[框架模版](https://github.com/yubo9807/plvue-template)
