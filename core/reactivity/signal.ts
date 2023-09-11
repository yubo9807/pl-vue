import { reactive } from "./reactive";

type Return<T> = [
  GetSignal: () => T,
  SetSignal: (val: T) => void,
]

export function createSignal<T>(value: T): Return<T>{

  const o = reactive({
    value,
  })

  function getSignal(): T {
    return o.value;
  }

  function setSignal(newValue: T) {
    o.value = newValue;
  }

  return [
    getSignal,
    setSignal,
  ]

}
