
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
// #region 
