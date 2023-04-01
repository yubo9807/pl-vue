import { reactive } from "./reactive";


export function createSignal<T>(value: T): [typeof getSignal, typeof setSignal]{

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
