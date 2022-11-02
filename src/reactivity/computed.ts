import { ref } from "./ref";

export function computed(value: Function) {
  return ref(value());
}
