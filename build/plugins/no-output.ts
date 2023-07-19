
/**
 * 排除输出文件
 * @param callback () => 为 true 时不输出文件
 * @returns 
 */
export default function (callback: (path: string) => boolean) {
  return {
    name: 'no-output',

    transform(code: string, id: string) {
      return callback(id) ? '' : code;
    },
  }
}