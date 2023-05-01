import { isObject } from "../utils/judge";
import { AnyObj, Key } from "../utils/type";
import { reactive } from "./reactive";

export const ISREF = '__v_isRef';

class RefImpl {

  [ISREF]       = true
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
    if (isObject(newValue)) {
      const keys = Object.keys(newValue);
      for (const prop in keys) {
        this._value[prop] = newValue[prop];  // 给每个键重新赋值（无需担心新键无法赋值）
      }
      for (const prop in this._rawValue) {
        !keys.includes(prop) && delete this._value[prop];  // 不用的键进行删除
      }
    } else {
      this._value.value = newValue;
    }

    this._rawValue = newValue;
  }

}

export type Ref<T> = { value: T }
/**
 * 原始值转为响应式数据
 * @param value 
 * @returns 
 */
export function ref<T>(value: T): Ref<T> {
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
 * 将 reactive 某一项转为 ref
 * @param target 
 * @param key 
 * @param defaultValue 
 * @returns 
 */
export function toRef<T>(target: T, key: Key, defaultValue = void 0) {
  return new ObjectRefImpl(target, key, defaultValue);
};

/**
 * 将 reactive 每一项转为 ref
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

class CustomRefImpl extends RefImpl {
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