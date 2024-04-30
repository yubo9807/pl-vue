import { AnyObj } from "../utils";
import { deepTriggerObject } from "./depend";
import { IS_REF, IS_SHALLOW, proxy } from "./proxy";

export class RefImpl<T> {

  [IS_REF]     = true;
  [IS_SHALLOW] = false;

  _rawValue?: { value: T }
  _value?:    T

  constructor(value: T, shallow = false) {
    this[IS_SHALLOW] = shallow;
    this._rawValue = proxy({ value }, { shallow });
    this._value = this._rawValue.value;
  }

  get value() {
    return this._rawValue.value;
  }

  set value(newValue) {
    this._rawValue.value = newValue;
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
 * ref 的浅层代理
 * @param value 
 * @returns 
 */
export function shallowRef<T>(value: T = void 0) {
  return new RefImpl(value, true);
}

/**
 * 强制触发 shallowRef
 * @param ref 
 */
export function triggerRef(ref: RefImpl<object>) {
  deepTriggerObject(unref(ref));
}

/**
 * 判断对象是否为 ref
 * @note vue 实现这个函数有点low，随便定义一个对象就可以判断
 * @param ref
 */
export function isRef(ref: unknown): ref is RefImpl<unknown> {
  return ref && !!ref[IS_REF];
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

  [IS_REF] = true

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
    this[IS_REF] = isRef;
    this._get = get;
    this._set = set;
  }

  get value(): T {
    return this[IS_REF] ? super.value : this._get();
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
