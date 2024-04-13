
/**
 * 一个自定义的性能比较好的 Array.forEach
 * @param arr 
 * @param callback 
 */
export function customForEach<T extends Array<any>, S>(arr: T, callback: (item: T[number], index: number, self?: S) => void, self?: S): void {
  let index = 0;
  while (index < arr.length) {
    if (arr.hasOwnProperty(index)) {
      const item = arr[index];
      callback.apply(self, [item, index, self]);
    }
    index++;
  }
}
