import { isArray, isBrowser, isType } from "./judge";
import { AnyObj } from "./type";

/**
 * 深度克隆
 * @param origin 被克隆对象
 * @param extend 扩展克隆方法
 */
export function deepClone<T>(origin: T, extend: Record<string, (val) => any> = {}) {
	const cache: any = new WeakMap();
	const noCloneTypes = ['null', 'regexp', 'date', 'weakset', 'weakmap'];
	
	const specialClone = Object.assign({
		function(func: Function) {
			const newFunc = function(...args) {
				return func.apply(this, args);
			}
			newFunc.prototype = _deepClone(func.prototype);
			return newFunc;
		},
		set(set: Set<any>) {
			const collect = new Set();
			for (const value of set) {
				collect.add(_deepClone(value));
			}
			return collect;
		},
		map(map: Map<any, any>) {
			const collect = new Map();
			for (const [ key, val ] of map.entries()) {
				collect.set(key, _deepClone(val));
			}
			return collect;
		},
	}, extend)

	function _deepClone<T>(_origin: T): T {
		if (isBrowser() && _origin instanceof HTMLElement) {
			return _origin.cloneNode(true) as T;
		}
		const type = isType(_origin);
		if (!['object', 'function'].includes(typeof _origin) || noCloneTypes.includes(type)) {
			return _origin;
		}

		// 防止环形引用问题（已经克隆过的对象不再进行克隆）
		if (cache.has(_origin)) {
			return cache.get(_origin);
		}

		// 特殊类型克隆处理
		if (specialClone[type]) {
			return specialClone[type](_origin);
		}

		// 创建一个新的对象
		const target: AnyObj = isArray(_origin) ? [] : {};
		Object.setPrototypeOf(target, Object.getPrototypeOf(_origin));

		// 设置缓存，该对象已经被克隆过
		cache.set(_origin, target);

		for (const key in _origin) {
			if (_origin.hasOwnProperty(key)) {
				target[key] = _deepClone(_origin[key]);
			}
		}
		return target as T;
	}

	return _deepClone(origin);
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
