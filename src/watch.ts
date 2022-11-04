import { computed } from "./reactivity/computed"

type Cb = (val: any) => void
type Option = {
  deep?:      boolean
  immediate?: boolean
}

export default function watch(source: Function, cb: Cb, option: Option = {}) {

  const target = computed({
    get: source,
    set(val) {
      console.log(val)
    }
  })
}
