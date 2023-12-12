import { reactive } from "./reactive";

type Return<T> = [
  GetSignal: () => T,
  SetSignal: (val: T) => void,
  Raw:       { value: T },
]

export function createSignal<T>(value: T): Return<T>{

  const raw = { value };
  const o = reactive(raw);

  function getSignal(): T {
    return o.value;
  }

  function setSignal(newValue: T) {
    o.value = newValue;
  }

  return [
    getSignal,
    setSignal,
    raw,
  ]

}
