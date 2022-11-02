import { AnyObj, Key } from "../utils/type";
import { reactive } from "./reactive";

/**
 * 原始值转为响应式数据
 * @param value 
 * @returns 
 */
export function ref(value: any) {
  return reactive({ value });
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

  /**
   * 获取
   */
  get value() {
    return this._object[this._key];
  }

  /**
   * 赋值
   */
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