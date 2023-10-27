import { isArray, isType } from "./judge";
import { AnyObj } from "./type";

export const deepClone = (function () {
	const cache = new WeakMap();
	const noCloneTypes = ['null', 'weakset', 'weakmap'];

	/**
	 * 深度克隆
	 * @param origin 被克隆对象
	 */
	return function<T>(origin: T, loop = false) {
		const type = isType(origin);
		if (typeof origin !== 'object' || noCloneTypes.includes(type)) {
			return origin;
		}

		// 防止环形引用问题（已经克隆过的对象不再进行克隆）
		if (loop && cache.has(origin)) {
			return cache.get(origin);
		}

		// 特殊类型克隆处理
		const specialClone = {
			set(set: Set<any>) {
				const collect = new Set();
				for (const value of set) {
					collect.add(deepClone(value, loop));
				}
				return collect;
			},
			map(map: Map<any, any>) {
				const collect = new Map();
				for (const [ key, val ] of map.entries()) {
					collect.set(key, deepClone(val, loop));
				}
				return collect;
			},
		}
		if (specialClone[type]) {
			return specialClone[type](origin);
		}

		// 创建一个新的对象
		const target: AnyObj = isArray(origin) ? [] : {};
		Object.setPrototypeOf(target, Object.getPrototypeOf(origin));

		// 设置缓存，该对象已经被克隆过
		loop && cache.set(origin, target);

		for (const key in origin) {
			target[key] = deepClone(origin[key]);
		}
		return target as T;
	}
}())


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
