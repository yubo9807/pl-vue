import { AnyObj, Key } from "../utils";
import { createSignal } from "./signal";

export const ISREF = '__v_isRef';

class RefImpl<T> {

  [ISREF]       = true
  __v_isShallow = false

  _rawValue: { value: T }
  _value:    T
  getSignal: () => T
  setSignal: (newValue: T) => void

  constructor(value: T) {
    const [ getSignal, setSignal, raw ] = createSignal(value);
    this._rawValue = raw;
    this.getSignal = getSignal;
    this.setSignal = setSignal;
    this._value = getSignal();
  }

  get value() {
    return this.getSignal();
  }

  set value(newValue) {
    this.setSignal(newValue);
  }

}

export type Ref<T> = { value: T }
/**
 * 原始值转为响应式数据
 * @param value 
 * @returns 
 */
export function ref<T>(value: T = void 0) {
  return new RefImpl(value);
}

/**
 * 判断对象是否为 ref
 * @note vue 实现这个函数有点low，随便定义一个对象就可以判断
 * @param ref
 */
export function isRef(ref: unknown) {
  return ref && !!ref[ISREF];
}

/**
 * 返回 ref 内部值
 * @param ref 
 * @returns 
 */
export function unref<T>(ref: Ref<T>) {
  return isRef(ref) ? ref.value : ref;
}

class ObjectRefImpl {

  __v_isRef = true

  _defaultValue: any
  _key:    Key
  _object: AnyObj
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
 * @param target 
 * @param key 
 * @param defaultValue 
 * @returns 
 */
export function toRef<T>(target: T, key: Key, defaultValue = void 0) {
  return new ObjectRefImpl(target, key, defaultValue);
};

/**
 * @param target 
 * @returns 
 */
export function toRefs<T>(target: T) {
  const obj: AnyObj = {};
  for (const key in target) {
    obj[key] = new ObjectRefImpl(target, key);
  }
  return obj;
}



type CustomRefCallback = (track: Function, trigger: Function) => ({ get: Function, set: Function})

class CustomRefImpl<T> extends RefImpl<T> {
  _get: Function
  _set: Function
  constructor(callback: CustomRefCallback) {
    let isRef = false;
    const { get, set } = callback(
      () => isRef = true,
      () => this.setValue(),
    );

    super(get());
    this.__v_isRef = isRef;
    this._get = get;
    this._set = set;
  }

  get value() {
    return this.__v_isRef ? super.value : this._get();
  }

  // 方法重写，阻断，将 val 指给 set 函数
  set value(val) {
    this._set(val);
  }

  /**
   * 设置 value，在合适的时间调用
   */
  setValue() {
    super.value = this._get();
  }
}

/**
 * 自定义 Ref
 * @param callback 
 * @returns 
 */
export function customRef(callback: CustomRefCallback) {
  return new CustomRefImpl(callback);
}