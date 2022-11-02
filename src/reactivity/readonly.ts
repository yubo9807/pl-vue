import { AnyObj } from "../utils/type";
import { ReactiveFlags, rawMap } from './reactive';


export function readonly(target: AnyObj) {

  Reflect.defineProperty(target, ReactiveFlags.IS_READONLY, {
    value: true,
  })

  return new Proxy(target, {

    get(target, key) {
      return Reflect.get(target, key);
    },

    set(target, key, value) {
      const oldValue = Reflect.get(target, key);
      console.warn(`Set operation on key '${key.toString()}' failed: target is readonly.`, { [key.toString()]: oldValue });
      return oldValue;
    },

    deleteProperty(target, key) {
      const oldValue = Reflect.get(target, key);
      console.warn(`Delete operation on key '${key.toString()}' failed: target is readonly.`, { [key.toString()]: oldValue });
      return oldValue;
    }

  })
}