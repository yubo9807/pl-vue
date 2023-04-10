import { ISREF, ref } from "./ref";
import { ReactiveEffect } from './effect'

class ComputedRefImpl {

  __v_isReadonly = true;
  [ISREF]        = true;
  _cacheable     = true;
  _dirty         = true;

  computed: ReactiveEffect
  _setter:  Function

  constructor(getter: Function, setter?: Function) {
    this.computed = new ReactiveEffect(getter);
    this._setter  = setter;
  }

  get value() {
    return this.computed.fn();
  }

  set value(val) {
    this._setter ? this._setter(val) : console.warn(`Write operation failed: computed value is readonly`);
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
    return new ComputedRefImpl(option);
  }

  return new ComputedRefImpl(option.get, option.set);
}
