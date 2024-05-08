// #region 减少打包代码体积
/**
 * 警告信息
 * @param msg
 */
function printWarn(...msg) {
    console.warn(...msg);
}
/**
 * 获取字符串或数组的长度
 * @param o
 * @returns
 */
function len(o) {
    return o.length;
}
// #region

/**
 * 属于什么类型
 * @param o
 */
function isType(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
}
/**
 * 是否属于自己的属性
 * @param target
 * @param key
 * @returns
 */
function hasOwn(target, key) {
    return Object.prototype.hasOwnProperty.call(target, key);
}
/**
 * 判断两个值是否相等
 * @param val1
 * @param val2
 * @returns
 */
function isEquals(val1, val2) {
    if (isObject(val1) && isObject(val2)) {
        const keys1 = Object.keys(val1), keys2 = Object.keys(val2);
        if (len(keys1) !== len(keys2))
            return false;
        for (const key of keys1) {
            if (!keys2.includes(key))
                return false;
            const bool = isEquals(val1[key], val2[key]);
            if (!bool)
                return false;
        }
        return true;
    }
    else {
        return val1 === val2;
    }
}
/**
 * 是否为浏览器环境
 * @returns
 */
function isBrowser() {
    return typeof window === 'object';
}
/**
 * 是否为 object 类型，包含 class
 * @param obj
 * @returns
 */
function isObject(obj) {
    return typeof obj === 'object' && obj !== null;
}
/**
 * 是否为一个普通的对象
 * @param obj
 * @returns
 */
function isNormalObject(obj) {
    return isStrictObject(obj) || isType(obj) === 'Array';
}
/**
 * 是否为一个严格的对象
 * @param obj
 * @returns
 */
function isStrictObject(obj) {
    return isType(obj) === 'Object';
}
/**
 * 是 array 类型
 * @param obj
 * @returns
 */
function isArray(arr) {
    return Array.isArray(arr);
}
function isFunction(value) {
    return typeof value === 'function';
}

/**
 * 异步执行一个函数
 * @param func
 */
function nextTick(func) {
    Promise.resolve().then(func);
}
// 兼容各种环境
// export function nextTick(func: Function) {
//   if (typeof Promise !== void 0) {
//     Promise.resolve().then(func as any);
//   } else if (typeof MutationObserver !== void 0) {
//     const ob = new MutationObserver(func as MutationCallback);
//     const textNode = document.createTextNode('0');
//     ob.observe(textNode, { characterData: true });
//     textNode.data = '1';
//   } else if (typeof process !== void 0) {
//     process.nextTick(func);
//   } else {
//     setTimeout(func, 0);
//   }
// }

class CustomWeakMap extends WeakMap {
}

/**
 * 深度克隆
 * @param origin 被克隆对象
 * @param extend 扩展克隆方法
 */
function deepClone(origin, extend = {}) {
    const cache = new CustomWeakMap();
    const noCloneTypes = ['Null', 'Regexp', 'Date', 'WeakSet', 'WeakMap'];
    const specialClone = Object.assign({
        Function(func) {
            const newFunc = function (...args) {
                return func.apply(this, args);
            };
            newFunc.prototype = _deepClone(func.prototype);
            return newFunc;
        },
        Set(set) {
            const collect = new Set();
            for (const value of set) {
                collect.add(_deepClone(value));
            }
            return collect;
        },
        Map(map) {
            const collect = new Map();
            for (const [key, val] of map.entries()) {
                collect.set(key, _deepClone(val));
            }
            return collect;
        },
    }, extend);
    function _deepClone(_origin) {
        if (isBrowser() && _origin instanceof HTMLElement) {
            return _origin.cloneNode(true);
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
        const target = isArray(_origin) ? [] : {};
        Object.setPrototypeOf(target, Object.getPrototypeOf(_origin));
        // 设置缓存，该对象已经被克隆过
        cache.set(_origin, target);
        for (const key in _origin) {
            if (_origin.hasOwnProperty(key)) {
                target[key] = _deepClone(_origin[key]);
            }
        }
        return target;
    }
    return _deepClone(origin);
}
// #region

// 下面自定义的一些遍历函数，没有考虑 hasOwn 和 this 指向的问题，因为这样会拖慢代码执行速度
// 也就是说不涉及到稀松数组的情况
/**
 * 一个自定义的性能比较好的 Array.forEach
 * @param array
 * @param callback
 */
function customForEach(array, callback) {
    let index = 0;
    while (index < len(array)) {
        callback(array[index], index);
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
function customFindIndex(array, callback) {
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
function customFind(array, callback) {
    const index = customFindIndex(array, callback);
    return array[index];
}

let func = null;
const funcsMap = new CustomWeakMap(); // 收集依赖的 map 集合
/**
 * 绑定响应式对象
 * @param fn 将响应式对象写在 fn 内，该对象重新赋值时会自行触发 fn()
 * 当返回 true 时，该函数将在依赖收集中删除，避免占用过多的内存
 */
function binding(fn) {
    func = fn;
    fn(); // 自执行触发 get 方法，方法被保存
    func = null;
}
let currentKeys = null;
/**
 * 依赖收集
 * @param source 存入 funcsMap 的键
 * @param key
 */
function dependencyCollection(source, key) {
    if (!func)
        return;
    const funcs = funcsMap.get(source) || [];
    const query = customFind(funcs, item => func === item.fn); // 是否有重复存在的函数
    if (query) {
        query.s.add(key);
        currentKeys = query.s;
    }
    else {
        const s = new Set([key]);
        funcs.push({ s, fn: func });
        funcsMap.set(source, funcs);
        currentKeys = s;
    }
    nextTick(() => currentKeys = null); // 回收内存
}
/**
 * 派发更新
 * @param source 存入 funcsMap 的键
 * @keys
 */
function distributeUpdates(source, keys) {
    const funcs = funcsMap.get(source);
    if (!funcs)
        return;
    customForEach(funcs, (item, index) => {
        const isRemove = item.fn(keys);
        // 清理下内存，将不用的函数删除
        isRemove === true && delete funcs[index];
    });
    funcsMap.set(source, funcs.filter(item => item));
}
/**
 * 回收依赖，清空当前已收集的依赖
 * @params sources ref 或 reactive 对象
 */
function recycleDepend(...sources) {
    function _recycleDepend(key) {
        const obj = toRaw(key);
        for (const prop in obj) {
            const val = obj[prop];
            isObject(val) && _recycleDepend(val);
        }
        funcsMap.delete(obj);
    }
    customForEach(sources, _recycleDepend);
}
/**
 * 深度执行 收集依赖
 * @param target
 */
function deepDependencyCollection(target) {
    for (const k in target) {
        dependencyCollection(target, k);
        const value = target[k];
        if (isNormalObject(value)) {
            deepDependencyCollection(value);
        }
    }
}
/**
 * 强制触发数据更新
 * @param target
 */
function triggerObject(target) {
    const keys = new Set(Object.keys(target));
    distributeUpdates(target, keys);
}
/**
 * 深度执行 派发更新
 * @param target
 */
function deepTriggerObject(target) {
    triggerObject(target);
    for (const k in target) {
        const value = target[k];
        if (isNormalObject(value)) {
            deepTriggerObject(value);
        }
    }
}

const IS_RAW = Symbol('__v_raw');
const IS_REF = Symbol('__v_isRef');
const IS_SHALLOW = Symbol('__v_isShallow');
const IS_SHALLOW_BEST = Symbol('__v_isShallowBest');
const IS_READONLY = Symbol('__v_isReadonly');
/**
 * 创建一个代理对象
 * @param target
 * @param option
 */
function proxy(target, option = {}) {
    const isReadonly = option.readonly;
    const isShallowBest = option.shallowBest;
    const isShallow = option.shallow;
    // readonly
    if (isReadonly) {
        Reflect.defineProperty(target, IS_READONLY, {
            value: true,
        });
    }
    const updateKeySet = new Set(); // 记录要更新的 key
    return new Proxy(target, {
        // 获取
        get(target, key, receiver) {
            if (key === IS_RAW)
                return target; // 返回原始值
            const result = Reflect.get(target, key);
            // readonly
            if (isReadonly)
                return result;
            // 浅响应式
            if (isShallow) {
                deepDependencyCollection(target);
                return result;
            }
            dependencyCollection(target, key); // 收集依赖
            if (isShallowBest)
                return result;
            return isNormalObject(result) ? proxy(result, option) : result;
        },
        // 赋值/修改
        set(target, key, value, receiver) {
            if (target[IS_READONLY])
                return true;
            const oldValue = Reflect.get(target, key);
            // readonly
            if (isReadonly) {
                printWarn(`Set operation on key '${key.toString()}' failed: target is readonly.`, { [key.toString()]: oldValue });
                return true;
            }
            if (isEquals(oldValue, value))
                return true;
            const result = Reflect.set(target, key, value);
            // 记录要更新的 key
            updateKeySet.add(key);
            const size = updateKeySet.size;
            nextTick(() => {
                if (size < updateKeySet.size)
                    return;
                const newValue = Reflect.get(target, key);
                if (result && !isEquals(oldValue, newValue)) {
                    // console.log(`%c update ${isType(target)}[${key.toString()}]: ${oldValue} --> ${value}`, 'color: orange');
                    distributeUpdates(target, updateKeySet);
                }
                updateKeySet.clear(); // 更新完成后清除记录
            });
            return result;
        },
        // 删除
        deleteProperty(target, key) {
            if (!hasOwn(target, key))
                return true; // 改对象上没有这个键
            const oldValue = Reflect.get(target, key);
            // readonly
            if (isReadonly) {
                printWarn(`Delete operation on key '${key.toString()}' failed: target is readonly.`, { [key.toString()]: oldValue });
                return true;
            }
            const result = Reflect.deleteProperty(target, key);
            // 记录要更新的 key
            updateKeySet.add(key);
            const size = updateKeySet.size;
            nextTick(() => {
                if (size < updateKeySet.size)
                    return;
                const hasKey = hasOwn(target, key); // 同一时间内，该键可能会被重新赋值。所以要保证数据真的被删
                const newValue = Reflect.get(target, key); // 数据被删，可能又被赋值为原先的值
                if (result && !hasKey && !isEquals(oldValue, newValue)) {
                    // console.log(`%c delete ${isType(target)}[${key.toString()}]`, 'color: red');
                    distributeUpdates(target, updateKeySet);
                }
                updateKeySet.clear();
            });
            return result;
        }
    });
}

/**
 * 将对象转为只读
 * @param target
 * @returns
 */
function readonly(target) {
    return proxy(target, { readonly: true });
}
/**
 * 检测是否为 readonly 对象
 * @param proxy
 * @returns
 */
function isReadonly(proxy) {
    return proxy && readonly(proxy)[IS_READONLY];
}
/**
 * readonly 的浅层作用形式
 * @param target
 * @returns
 */
function shallowReadonly(target) {
    return proxy(target, {
        shallow: true,
        readonly: true,
    });
}

const rawMap = new CustomWeakMap();
/**
 * 将数据变为响应式数据（深度）
 * @param target
 * @returns
*/
function reactive(target) {
    if (!isNormalObject(target) || Object.isFrozen(target)) {
        printWarn(`lue cannot be made reactive: ${target}`);
        return target;
    }
    if (rawMap.get(target))
        return target;
    return proxy(target);
}
/**
 * 判断是否为 reactive 对象
 * @param reactive
 * @returns
 */
function isReactive(reactive) {
    return isObject(reactive) && !!reactive[IS_RAW];
}
/**
 * reactive 对象转普通对象
 * @param reactive
 * @returns
 */
function toRaw(reactive) {
    return isReactive(reactive) ? reactive[IS_RAW] : reactive;
}
/**
 * 检测是否为响应式对象
 * @param proxy
 */
function isProxy(proxy) {
    return isReactive(proxy) || isReadonly(proxy);
}
/**
 * 标记该对象将不能设置为代理对象
 * @param obj
 * @returns
 */
function markRaw(obj) {
    if (isObject(obj))
        rawMap.set(obj, true);
    return obj;
}
/**
 * reactive 的浅层作用形式
 * @param obj
 * @returns
 */
function shallowReactive(obj) {
    return proxy(obj, { shallow: true });
}

class RefImpl {
    [IS_REF] = true;
    [IS_SHALLOW] = false;
    [IS_SHALLOW_BEST] = false;
    _rawValue;
    _value;
    constructor(value, type = 0) {
        const shallow = type === 1;
        const shallowBest = type === 2;
        this[IS_SHALLOW] = shallow;
        this[IS_SHALLOW_BEST] = shallowBest;
        this._rawValue = value;
        this._value = proxy({ value }, { shallow, shallowBest });
    }
    get value() {
        return this._value.value;
    }
    set value(newValue) {
        this._rawValue = newValue;
        this._value.value = newValue;
    }
}
/**
 * 原始值转为响应式数据
 * @param value
 * @returns
 */
function ref(value = void 0) {
    return new RefImpl(value);
}
/**
 * 性能最好的浅响应式对象（不会深度遍历收集依赖，也就无法强制更新）
 * 只能通过重新覆盖整个对象来触发更新
 * @param value
 * @returns
 */
function shallowBestRef(value = void 0) {
    return new RefImpl(value, 2);
}
/**
 * ref 的浅层代理
 * @param value
 * @returns
 */
function shallowRef(value = void 0) {
    return new RefImpl(value, 1);
}
/**
 * 强制触发 shallowRef
 * @param ref
 */
function triggerRef(ref) {
    deepTriggerObject(unref(ref));
}
/**
 * 判断对象是否为 ref
 * @note vue 实现这个函数有点low，随便定义一个对象就可以判断
 * @param ref
 */
function isRef(ref) {
    return ref && !!ref[IS_REF];
}
/**
 * 返回 ref 内部值
 * @param ref
 * @returns
 */
function unref(ref) {
    return isRef(ref) ? ref.value : ref;
}
class ObjectRefImpl {
    [IS_REF] = true;
    _defaultValue;
    _key;
    _object;
    constructor(target, key, defaultValue = void 0) {
        this._defaultValue = defaultValue;
        this._key = key;
        this._object = target;
    }
    get value() {
        return this._object[this._key];
    }
    set value(value) {
        this._object[this._key] = value;
    }
}
/**
 * @param target
 * @param key
 * @param defaultValue
 * @returns
 */
function toRef(target, key, defaultValue = void 0) {
    return new ObjectRefImpl(target, key, defaultValue);
}
/**
 * @param target
 * @returns
 */
function toRefs(target) {
    const obj = {};
    for (const key in target) {
        obj[key] = new ObjectRefImpl(target, key);
    }
    return obj;
}
class CustomRefImpl extends RefImpl {
    _get;
    _set;
    constructor(callback) {
        let isRef = false;
        const { get, set } = callback(() => isRef = true, () => this.setValue());
        super(get());
        this[IS_REF] = isRef;
        this._get = get;
        this._set = set;
    }
    get value() {
        return this[IS_REF] ? super.value : this._get();
    }
    // 方法重写，阻断，将 val 指给 set 函数
    set value(val) {
        this._set(val);
    }
    /**
     * 设置 value，在合适的时间调用
     */
    setValue() {
        super.value = this._get();
    }
}
/**
 * 自定义 Ref
 * @param callback
 * @returns
 */
function customRef(callback) {
    return new CustomRefImpl(callback);
}

function createSignal(value) {
    const raw = { value };
    const o = reactive(raw);
    function getSignal() {
        return o.value;
    }
    function setSignal(newValue) {
        o.value = newValue;
    }
    return [
        getSignal,
        setSignal,
        raw,
    ];
}

class ReactiveEffect {
    fn;
    computed;
    active = true;
    constructor(fn) {
        this.fn = fn;
        this.computed = ref(fn());
        this.scheduler();
    }
    /**
     * 任务调度
     */
    scheduler() {
        binding(() => {
            if (!this.active)
                return true;
            this.computed.value = this.run();
        });
    }
    /**
     * 执行任务
     * @returns
     */
    run() {
        return this.fn();
    }
    /**
     * 停止任务调度
     */
    stop() {
        this.active = false;
    }
}

class ComputedRefImpl {
    [IS_READONLY] = true;
    [IS_REF] = true;
    _cacheable = true;
    effect;
    _setter;
    _value;
    _dirty;
    constructor(getter, setter, dirty = false) {
        this.effect = new ReactiveEffect(getter);
        this._setter = setter;
        this._dirty = dirty;
    }
    get value() {
        return this._dirty ? this.effect.computed.value : this.effect.fn();
    }
    set value(val) {
        if (this._setter) {
            this._setter(val);
        }
        else {
            printWarn(`Write operation failed: computed value is readonly`);
        }
    }
}
/**
 * 计算属性
 * @param option
 * @returns
 */
function computed(option) {
    if (isFunction(option)) {
        return new ComputedRefImpl(option, null, true);
    }
    // @ts-ignore
    return new ComputedRefImpl(option.get, option.set, true);
}

/**
 * 侦听器
 * @param source  响应式数据
 * @param cb      回调函数
 * @param option  配置参数
 * @returns unwatch() 取消监听
 */
function watch(source, cb, option = {}) {
    let cleanup = false;
    if (cleanup)
        return;
    const oldValue = source();
    option.immediate && cb(oldValue, void 0);
    let backup = deepClone(oldValue);
    let first = true;
    binding(() => {
        if (cleanup)
            return true;
        const value = source();
        // 是一个对象
        if (isNormalObject(value)) {
            if (option.deep && !isEquals(value, backup)) {
                cb(value, backup);
                backup = deepClone(value);
            }
            return;
        }
        // 原始值
        if (first) { // 第一次不进行回调，上面已经执行过一次
            first = false;
            return;
        }
        if (value !== backup) {
            cb(value, backup);
            backup = value;
        }
    });
    return () => {
        cleanup = true;
        // 释放内存
        backup = source = cb = option = null;
    };
}
/**
 * 立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行
 * @param cb
 * @returns stop() 取消监听
 */
function watchEffect(cb) {
    let cleanup = false;
    let isFirst = true;
    let monitorKeys = null; // 监听的 key
    binding((updateKeys) => {
        if (cleanup)
            return true;
        if (!isFirst) {
            // 如果更新的 key 中找不到监听的 key，不执行回调
            for (const key of updateKeys) {
                if (!monitorKeys.has(key))
                    return;
            }
        }
        cb((cleanupFn) => {
            cleanupFn();
        });
        if (isFirst) {
            // 第一次执行后，知道了需要监听的 key
            monitorKeys = currentKeys;
            console.log(monitorKeys);
            isFirst = false;
        }
    });
    return () => {
        cleanup = true;
        // 释放内存
        cb = monitorKeys = null;
    };
}

export { RefImpl, binding, computed, createSignal, customRef, deepTriggerObject, isProxy, isReactive, isRef, markRaw, reactive, readonly, recycleDepend, ref, shallowBestRef, shallowReactive, shallowReadonly, shallowRef, toRaw, toRef, toRefs, triggerObject, triggerRef, unref, watch, watchEffect };
