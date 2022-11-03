import { isObject } from "../utils/judge";
import { AnyObj, Key } from "../utils/type";
import { reactive } from "./reactive";

class RefImpl {

  __v_isRef     = true
  __v_isShallow = false

  _rawValue: any
  _value:    any

  constructor(value: any) {
    this._rawValue = value;
    this._value    = isObject(value) ? reactive(value) : reactive({ value });
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

/**
 * 判断对象是否为 ref
 * @note vue 实现这个函数有点low，随便定义一个对象就可以判断
 * @param ref
 */
export function isRef(ref: RefImpl) {
  return ref.__v_isRef
}

/**
 * 返回 ref 内部值
 * @param ref 
 * @returns 
 */
export function unref(ref: RefImpl) {
  return isRef(ref) ? ref.value : ref;
}

class ObjectRefImpl {

  __v_isRef = true

  _defaultValue: any
  _key:          Key
  _object:       AnyObj
  constructor(target: AnyObj, key: Key, defaultValue = void 0) {
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