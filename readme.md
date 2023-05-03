# 手写前端框架

（Vue 的响应式，React 的身影）。集成组件化、挂载钩子、Router、Store... 大小不到 20KB

## 数据响应式

> Vue 数据响应式的本意是数据与函数之间联动。数据变换后，用到该数据的联动函数自动重新执行。

除实现 Vue 中的一些响应式外，还提供了一个 `binding` 函数，可以在响应式数据变化后自动执行。

```ts
const count = ref(0);
binding(() => {
  el.innerText = count.value;
})

btn.onclick = () => count.value++;
```

## 组件化

响应式数据请写为函数形式，并且一定要有返回值（因为函数的实现方式最简单）

```tsx
function Comp() {
  const count = ref(0);
  return <div>
    <h1>{() => count.value}</h1>
    <button onclick={() => count.value++}></button>
  </div>
}
```

### Props

同样 props 响应式数据也需要传递为函数，对应的节点才会重新渲染

```tsx
// 父组件
function Comp() {
  const count = ref(0);
  return <div>
    <SubComp>插槽</SubComp>
  </div>
}
```

```tsx
// 子组件
type Props = {
  count: () => number
  children: any
}
function SubComp(props: Props) {
  return <div>
    <h1>count: {props.count}</h1>
    {props.children}
  </div>
}
```

### 高阶组件

```tsx
function HignOrderComp(props) {
  return <div>
    <Comp {...props} />
  </div>
}

function Page() {
  return <div>
    <HignOrderComp text='hello' />
  </div>
}
function Comp(props) {
  return <div>{props.text}</div>
}
```

### 性能

> 暂时此框架并未涉及任何算法

与 Vue 做过比较，同样渲染 50000 个节点，在时间上是差不多的。

```tsx
function Page() {
  const arr = ref(new Array(50000).fill(1));
  return <>
    {() => arr.value.map(val => <p>{val}</p>)}
  </>
}
```

但如果这这些个节点包装在一个节点内，就会快很多。同样带来的问题是：在之后改变数组中的某个时，都会使这些节点整个重新渲染一遍。而上面的情况不会。

所以性能问题按具体需求使用。

```tsx
function Page() {
  const arr = ref(new Array(50000).fill(1));
  return <>
    {() => <div>{
      arr.value.map(val => <p>{val}</p>)
    }</div>}
  </>
}
```

## 钩子函数

> 其中 `onBeforeUnmount`、`onUnmounted` 需传递组件名，否则不知道是谁卸载了。若有大神有别的方法，还请告知，万分感谢🙏。

| 钩子 | 执行时间 |
| --- | --- | --- |
| onBeforeMount | 已创建实例，但组件还未渲染 |
| onMounted | 组件渲染后执行 |
| onBeforeUnmount | 组件卸载前执行 |
| onUnmounted | 组件卸载后执行 |

## Router

最基本的单页面路由跳转，页面渲染与重定向组件

## Store

基于 reactive、watch、nextTick 实现，同样适用于 vue@2.7 | vue@3 中。

## 服务端渲染

服务端字符串输出，页面组件渲染前数据请求。
