import { AnyObj, Key } from "../utils/type";
import { reactive } from "./reactive";


export function ref(target: any) {
  return reactive({ value: target });
}

class ObjectRefImpl {
  __v_isRef:     boolean
  _defaultValue: any
  _key:          Key
  _object:       AnyObj
  constructor(target: AnyObj, key: Key, defaultValue = void 0) {
    this.__v_isRef     = true;
    this._defaultValue = defaultValue;
    this._key          = key;
    this._object       = target;
  }

  get value() {
    return this._object[this._key];
  }

  set value(value) {
    this._object[this._key] = value;
  }

}

export function toRef(target: AnyObj, key: Key, defaultValue = void 0) {
  return new ObjectRefImpl(target, key, defaultValue);
};

export function toRefs(target: AnyObj) {
  const obj = {};
  for (const key in target) {
    obj[key] = new ObjectRefImpl(target, key);
  }
  return obj;
}