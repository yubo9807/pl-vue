import { AnyObj } from "../utils";
import { createSignal } from "./signal";

export const ISREF = Symbol('__v_isRef');

export class RefImpl<T> {

  [ISREF] = true;

  _rawValue?: { value: T }
  _value?:    T
  getSignal?: () => T
  setSignal?: (newValue: T) => void

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
export function isRef(ref: unknown): ref is RefImpl<unknown> {
  return ref && !!ref[ISREF];
}

/**
 * 返回 ref 内部值
 * @param ref 
 * @returns 
 */
export function unref<T>(ref: RefImpl<T>) {
  return isRef(ref) ? ref.value : ref;
}

class ObjectRefImpl<T extends object> {

  [ISREF]       = true

  _defaultValue: any
  _key:    keyof T
  _object: T
  constructor(target: T, key: keyof T, defaultValue = void 0) {
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
export function toRef<T extends object>(target: T, key: keyof T, defaultValue = void 0) {
  return new ObjectRefImpl(target, key, defaultValue);
};

/**
 * @param target 
 * @returns 
 */
export function toRefs<T extends object>(target: T) {
  const obj: AnyObj = {};
  for (const key in target) {
    obj[key] = new ObjectRefImpl(target, key);
  }
  return obj;
}



type CustomRefCallback<T> = (track: Function, trigger: Function) => ({ get: () => T, set: (val: T) => void })

class CustomRefImpl<T> extends RefImpl<T> {
  _get: Function
  _set: Function
  constructor(callback: CustomRefCallback<T>) {
    let isRef = false;
    const { get, set } = callback(
      () => isRef = true,
      () => this.setValue(),
    );

    super(get());
    this[ISREF] = isRef;
    this._get = get;
    this._set = set;
  }

  get value(): T {
    return this[ISREF] ? super.value : this._get();
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
export function customRef<T>(callback: CustomRefCallback<T>) {
  return new CustomRefImpl(callback);
}