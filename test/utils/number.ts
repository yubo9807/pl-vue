/**
 * 生成随机数
 * @param max 最大值（取不到）
 * @param min 最小值
 */
export function randomNum(max: number, min: number = 0) {
  return Math.floor(Math.random() * (max - min) + min);
}
