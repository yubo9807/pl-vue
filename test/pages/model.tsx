import { h, isRef, PropsType, ref, RefImpl, watch } from "~/core"

function App() {
  const text = ref('hello');
  watch(text, value => {
    console.log(value);
  })

  return <Input model={text} />
}

type Props = PropsType<{
  model: string | RefImpl<string>
  onInput?: (text: string) => void
}>
function Input(props: Props) {
  const model = isRef(props.model) ? props.model : ref(props.model);
  function onInput(e: InputEvent) {
    const { value } = e.target as HTMLInputElement
    model.value = value;
    props.onInput?.(value);
  }
  return <input value={() => model.value} oninput={onInput} />
}

export default App;
