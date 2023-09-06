# Pl Vue

对 Vue 源码的学习（其中也有些参考 react 的地方，DOM 渲染使用 JSX），可作为第三方库使用，也可搭建用户界面。

- [文档地址](http://plvue.hpyyb.cn/)
- [框架模版](https://github.com/yubo9807/plvue-template)

## 示例

```tsx
import { h, ref, render } from 'pl-vue';

function App() {
  const count = ref(0);

  return <div>
    {/* 响应式数据一律以函数形式返回 */}
    <h1>{() => count.value}</h1>
    <button onclick={() => count.value++}></button>
  </div>
}

const root = document.getElementById('root');
root.appendChild(render(<App />));
```
