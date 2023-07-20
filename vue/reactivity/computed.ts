import { ISREF } from "./ref";
import { ReactiveEffect } from './effect'
import { printWarn } from "../utils/string";

type Getter<T> = () => T
type Setter<T> = (val: T) => void
type ComputedOption<T> = Getter<T> | {
  get: Getter<T>
  set: Setter<T>
}

class ComputedRefImpl<T> {

  __v_isReadonly = true;
  [ISREF]        = true;
  _cacheable     = true;
  _dirty         = true;

  computed: ReactiveEffect
  _setter:  Function

  constructor(getter: Getter<T>, setter?: Setter<T>) {
    this.computed = new ReactiveEffect(getter);
    this._setter  = setter;
  }

  get value(): T {
    return this.computed.fn();
  }

  set value(val: T) {
    if (this._setter) {
      this._setter(val);
    } else {
      printWarn(`Write operation failed: computed value is readonly`);
    }
  }

}


/**
 * 计算属性
 * @param option 
 * @returns 
 */
export function computed<T>(option: ComputedOption<T>) {
  if (typeof option === 'function') {
    return new ComputedRefImpl(option);
  }

  return new ComputedRefImpl(option.get, option.set);
}
