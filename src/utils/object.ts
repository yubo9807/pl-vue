
/**
 * 深度克隆对象
 * @param obj 
 */
export function clone(obj: any) {
  if (obj instanceof Array) return cloneArray(obj);
  else if (obj instanceof Object) return cloneObject(obj);
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
