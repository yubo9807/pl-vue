
/**
 * 数字生成器
 * @call const iter = createNum(); iter.next().value;
 */
export function* createNum() {  // 生成器函数传参毫无意义
  let n = 0
  while (true) {
      yield n;
      n++;
  }
}
