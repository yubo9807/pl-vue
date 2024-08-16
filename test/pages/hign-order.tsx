import { h, onMounted, PropsType, ref } from "~/core";

type Props = PropsType<{
  text: string
}>
function Comp(props: Props) {
  return <div ref={props.ref}>{props.text}</div>
}

function HignOrderComp(props: Parameters<typeof Comp>[0]) {
  props.text = props.text.replace(/l/g, '');
  return <Comp {...props} />
}

function App() {
  const elRef = ref<HTMLElement>();
  onMounted(() => {
    console.log(elRef.value);  //--> <div>heo</div>
  })
  return <HignOrderComp ref={elRef} text='hello' />
}

export default App;
