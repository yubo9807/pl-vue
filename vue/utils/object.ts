import { isObject } from "./judge";

/**
 * 深度克隆对象
 * @param obj 
 */
export function clone(obj: any) {
  if (obj instanceof Array) return cloneArray(obj);
  else if (isObject(obj)) return cloneObject(obj);
  else return obj;
}

function cloneObject(obj: any) {
  let result = {};
  let names = Object.getOwnPropertyNames(obj);
  for (let i = 0; i < names.length; i ++) {
    result[names[i]] = clone(obj[names[i]]);
  }
  return result;
}

function cloneArray(obj: any) {
  let result = new Array(obj.length);
  for (let i = 0; i < result.length; i ++) {
    result[i] = clone(obj[i]);
  }
  return result;
}


// #region 减少打包代码体积
/**
 * 合并对象
 * @param obj1 
 * @param obj2 
 * @returns 
 */
export function objectAssign<O1, O2>(obj1: O1, obj2: O2) {
  return Object.assign({}, obj1, obj2);
}
// #region 
