import { isObject } from "../utils/judge";
import { AnyObj, Key } from "../utils/type";
import { reactive } from "./reactive";

class RefImpl {

  __v_isRef:     boolean
  __v_isShallow: boolean
  _rawValue:     any
  _value:        any

  constructor(value: any) {
    this.__v_isRef     = true;
    this.__v_isShallow = false;
    this._rawValue     = value;
    this._value        = isObject(value) ? reactive(value) : reactive({ value });
  }


  get value() {
    return isObject(this._rawValue) ? this._value : this._value.value;
  }

  set value(newValue) {
    this._rawValue = newValue;

    if (isObject(newValue)) this._value = newValue;
    else this._value.value = newValue;
  }

}

/**
 * 原始值转为响应式数据
 * @param value 
 * @returns 
 */
export function ref(value: any) {
  return new RefImpl(value);
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

/**
 * 将 reactive 某一项转为 ref
 * @param target 
 * @param key 
 * @param defaultValue 
 * @returns 
 */
export function toRef(target: AnyObj, key: Key, defaultValue = void 0) {
  return new ObjectRefImpl(target, key, defaultValue);
};

/**
 * 将 reactive 每一项转为 ref
 * @param target 
 * @returns 
 */
export function toRefs(target: AnyObj) {
  const obj = {};
  for (const key in target) {
    obj[key] = new ObjectRefImpl(target, key);
  }
  return obj;
}