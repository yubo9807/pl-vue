import { ReactiveEffect } from './effect'
import { printWarn, isFunction } from "../utils";
import { IS_READONLY, IS_REF } from './proxy';
import { collectMonitor } from './scope';

type Getter<T> = () => T
type Setter<T> = (val: T) => void

export class ComputedRefImpl<T> {

  [IS_READONLY] = true;
  [IS_REF]      = true;
  _cacheable    = true;
  
  effect:  ReactiveEffect<T>
  _setter: Setter<T>
  _value:  T
  _dirty:  boolean

  constructor(getter: Getter<T>, setter?: Setter<T>, dirty = false) {
    this.effect  = new ReactiveEffect(getter);
    this._setter = setter;
    this._dirty  = dirty;
  }

  get value(): T {
    return this._dirty ? this.effect.computed.value : this.effect.fn();
  }

  set value(val: T) {
    if (this._setter) {
      this._setter(val);
    } else {
      printWarn(`Write operation failed: computed value is readonly`);
    }
  }

}


type ComputedOption<T> = Getter<T> | {
  get: Getter<T>
  set: Setter<T>
}

/**
 * 计算属性
 * @param option 
 * @returns 
 */
export function computed<T>(option: ComputedOption<T>) {
  let result: ComputedRefImpl<T>;
  if (isFunction(option)) {
    result = new ComputedRefImpl(option as Getter<T>, null, true);
  } else {
    result = new ComputedRefImpl(option.get, option.set, true);
  }
  collectMonitor(result);
  return result;
}
