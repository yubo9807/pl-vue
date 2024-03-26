import { PropsType, defineExpose, h } from "~/core";

export type MyCompProps = PropsType<{
  title: string
}>
export default function(props: MyCompProps) {
  defineExpose({
    aaa: 111,
  })
  return <div>
    <h1>{props.title}</h1>
    <button onclick={() => console.log(111)}>click</button>
    {props.children}
  </div>
}
