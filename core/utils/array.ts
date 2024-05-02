import { len } from "./string";

// 下面自定义的一些遍历函数，没有考虑 hasOwn 和 this 指向的问题，因为这样会拖慢代码执行速度
// 也就是说不涉及到稀松数组的情况

/**
 * 一个自定义的性能比较好的 Array.forEach
 * @param array 
 * @param callback 
 */
export function customForEach<T extends Array<any>>(array: T, callback: (item: T[number], index: number) => void): void {
  let index = 0;
  while (index < len(array)) {
    callback(array[index], index)
    index++;
  }
}

/**
 * Array.findIndex
 * @param array 
 * @param callback 
 * @param self 
 * @returns 
 */
export function customFindIndex<T extends Array<any>>(array: T, callback: (item: T[number], index: number) => unknown): number {
  let index = 0;
  while (index < len(array)) {
    const item = array[index];
    if (callback(item, index)) {
      return index;
    }
    index++;
  }
  return -1;
}

/**
 * Array.find
 * @param array 
 * @param callback 
 * @param self 
 * @returns 
 */
export function customFind<T extends Array<any>>(array: T, callback: (item: T[number], index: number) => boolean): T[number] | void {
  const index = customFindIndex(array, callback);
  return array[index];
}

/**
 * 二分查找
 * @param array       一个有序的数据
 * @param queryValue  查找内容
 * @param generateKey 返回一个可比较大小的值
 * @returns 
 */
export function binarySearch<T extends Array<any>, Q>(array: T, queryValue: Q, generateKey: (v: T[number]) => Q = v => v) {
  let start = 0;
  let end = len(array) - 1;
  while (start <= end) {
    const midden = Math.ceil((start + end) / 2);
    const val = array[midden];
    const item = generateKey(val);
    if(queryValue === item) {
      return midden;
    } else if (queryValue < item) {  // 在左边
      end = midden - 1;
    } else if (queryValue > item) {  // 在右边
      start = midden + 1;
    }
  }
  return -1;
}
