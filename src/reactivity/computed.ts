import { ref } from "./ref";
import { ReactiveEffect } from './effect'
import { isObject } from "../utils/judge";

const map = new WeakMap();

class ComputedRefImpl {

  __v_isReadonly = true
  __v_isRef      = true
  _cacheable     = true
  _dirty         = true

  computed: ReactiveEffect
  _setter:  Function

  constructor(getter: Function, setter: Function) {
    this.computed = new ReactiveEffect(getter);
    this._setter  = setter;

    map.set(getter, ref(getter()));
  }

  get value() {
    return this.computed.fn();
  }

  set value(val) {
    const oldValue = this.computed.fn();
    if (!isObject(oldValue)) {
      console.warn(`Write operation failed: computed value is readonly`);
      return;
    }

    map.get(this.computed.fn).value = val;
    this._setter(val);
  }

}

type ComputedOption = Function | {
  get: Function
  set: Function
}

/**
 * 计算属性
 * @param option 
 * @returns 
 */
export function computed(option: ComputedOption) {
  if (typeof option === 'function') {
    return new ComputedRefImpl(option, function set(val) {});
  }

  return new ComputedRefImpl(option.get, option.set);
}
