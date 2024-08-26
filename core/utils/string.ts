
export function createId() {
  return Number((Math.random() + '').slice(2)).toString(32);
}


// #region 减少打包代码体积
/**
 * 警告信息
 * @param msg 
 */
export function printWarn(...msg: any[]) {
  console.warn(...msg)
}

/**
 * 错误信息
 * @param msg 
 */
export function throwError(msg: string) {
  throw new Error(msg);
}

/**
 * 获取字符串或数组的长度
 * @param o 
 * @returns 
 */
export function len(o: string | any[]) {
  return o.length;
}
// #region 
