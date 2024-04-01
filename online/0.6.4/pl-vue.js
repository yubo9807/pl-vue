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
    return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
}
/**
 * 函数是否是为类声明
 * @param func
 * @returns
 */
function isClass(func) {
    return func.toString().slice(0, 5) === 'class';
}
/**
 * 从内存上看是否是一个对象
 * @param o
 */
function isMemoryObject(o) {
    return ['object', 'array'].includes(isType(o));
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
    if (isMemoryObject(val1) && isMemoryObject(val2)) {
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
// #region 减少打包代码体积
/**
 * 是 object 类型
 * @param obj
 * @returns
 */
function isObject(obj) {
    return isType(obj) === 'object';
}
/**
 * 是 array 类型
 * @param obj
 * @returns
 */
function isArray(arr) {
    return Array.isArray(arr);
}
/**
 * 是 string 类型
 * @param obj
 * @returns
 */
function isString(text) {
    return typeof text === 'string';
}
function isFunction(value) {
    return typeof value === 'function';
}
// #region

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
    const noCloneTypes = ['null', 'regexp', 'date', 'weakset', 'weakmap'];
    const specialClone = Object.assign({
        function(func) {
            const newFunc = function (...args) {
                return func.apply(this, args);
            };
            newFunc.prototype = _deepClone(func.prototype);
            return newFunc;
        },
        set(set) {
            const collect = new Set();
            for (const value of set) {
                collect.add(_deepClone(value));
            }
            return collect;
        },
        map(map) {
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
// #region 减少打包代码体积
/**
 * 合并对象
 * @param obj1
 * @param obj2
 * @returns
 */
function objectAssign(obj1, obj2) {
    return Object.assign({}, obj1, obj2);
}
// #region

/**
 * 一个自定义的性能比较好的 Array.forEach
 * @param arr
 * @param callback
 */
function customForEach(arr, callback, self) {
    let index = 0;
    while (index < arr.length) {
        if (arr.hasOwnProperty(index)) {
            const item = arr[index];
            callback.apply(self, [item, index, self]);
        }
        index++;
    }
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
/**
 * 依赖收集
 * @param key 存入 funcsMap 的键
 */
function dependencyCollection(key) {
    const funcs = funcsMap.get(key) || [];
    const bool = funcs.some(fn => func === fn); // 是否有重复存在的函数
    if (func && !bool) {
        funcs.push(func);
        funcsMap.set(key, funcs);
    }
}
/**
 * 派发更新
 * @param key 存入 funcsMap 的键
 */
function distributeUpdates(key) {
    const funcs = funcsMap.get(key);
    funcs && customForEach(funcs, (fn, index) => {
        const del = fn();
        // 清理下内存，将不用的函数删除
        if (del === true) {
            funcs.splice(index, 1);
            funcsMap.set(key, funcs);
        }
    });
}
/**
 * 回收依赖，清空当前已收集的依赖
 * @param key ref 或 reactive 对象
 */
function recycleDepend(...keys) {
    function _recycleDepend(key) {
        const obj = toRaw(key);
        for (const prop in obj) {
            const val = obj[prop];
            isMemoryObject(val) && _recycleDepend(val);
        }
        funcsMap.delete(obj);
    }
    customForEach(keys, _recycleDepend);
}

/**
 * 将对象转为只读
 * @param target
 * @returns
 */
function readonly(target) {
    Reflect.defineProperty(target, ReactiveFlags.IS_READONLY, {
        value: true,
    });
    return new Proxy(target, {
        get(target, key) {
            if (key === ReactiveFlags.RAW)
                return target; // 返回原始值
            return Reflect.get(target, key);
        },
        set(target, key, value) {
            const oldValue = Reflect.get(target, key);
            printWarn(`Set operation on key '${key.toString()}' failed: target is readonly.`, { [key.toString()]: oldValue });
            return oldValue;
        },
        deleteProperty(target, key) {
            const oldValue = Reflect.get(target, key);
            printWarn(`Delete operation on key '${key.toString()}' failed: target is readonly.`, { [key.toString()]: oldValue });
            return oldValue;
        }
    });
}
/**
 * 检测是否为 readonly 对象
 * @param proxy
 * @returns
 */
function isReadonly(proxy) {
    return proxy && readonly(proxy)[ReactiveFlags.IS_READONLY];
}

const rawMap = new CustomWeakMap();
const updateKeysMap = new CustomWeakMap();
const ReactiveFlags = {
    RAW: Symbol('__v_raw'),
    IS_READONLY: Symbol('__v_isReadonly'),
};
/**
 * 将数据变为响应式数据（深度）
 * @param target
 * @returns
*/
function reactive(target) {
    if (!isMemoryObject(target) || Object.isFrozen(target)) {
        printWarn(`lue cannot be made reactive: ${target}`);
        return target;
    }
    if (rawMap.get(target))
        return target;
    let backupKey = null; // 备份当前改变的 key
    return new Proxy(target, {
        // 获取
        get(target, key, receiver) {
            if (key === ReactiveFlags.RAW)
                return target; // 返回原始值
            const result = Reflect.get(target, key, receiver);
            dependencyCollection(target);
            return isMemoryObject(result) ? reactive(result) : result;
        },
        // 赋值/修改
        set(target, key, value, receiver) {
            if (target[ReactiveFlags.IS_READONLY])
                return true;
            const oldValue = Reflect.get(target, key, receiver);
            if (oldValue === value)
                return true;
            const result = Reflect.set(target, key, value, receiver);
            // 记录要更新的 key
            const updateKeys = updateKeysMap.get(target) || new Set();
            updateKeys.add(key);
            const size = updateKeys.size;
            updateKeysMap.set(target, updateKeys);
            nextTick(() => {
                if (result && size === 1) {
                    // console.log(`%c update ${isType(target)}[${key.toString()}]: ${oldValue} --> ${value}`, 'color: orange');
                    distributeUpdates(target); // 在同一时刻多次改变数据，只更新一次即可
                }
                updateKeysMap.delete(target); // 更新完成后清除记录
            });
            return result;
        },
        // 删除
        deleteProperty(target, key) {
            const oldValue = Reflect.get(target, key);
            const hasKey = hasOwn(target, key);
            const result = Reflect.deleteProperty(target, key);
            backupKey = key;
            nextTick(() => {
                if (hasKey && result && oldValue !== void 0 && key === backupKey) {
                    // console.log(`%c delete ${isType(target)}[${key.toString()}]`, 'color: red');
                    distributeUpdates(target);
                    backupKey = null;
                }
            });
            return result;
        }
    });
}
/**
 * 判断是否为 reactive 对象
 * @param reactive
 * @returns
 */
function isReactive(reactive) {
    return isObject(reactive) && !!reactive[ReactiveFlags.RAW];
}
/**
 * reactive 对象转普通对象
 * @param reactive
 * @returns
 */
function toRaw(reactive) {
    return isReactive(reactive) ? reactive[ReactiveFlags.RAW] : reactive;
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
    if (isMemoryObject(obj))
        rawMap.set(obj, true);
    return obj;
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

const ISREF = Symbol('__v_isRef');
class RefImpl {
    [ISREF] = true;
    _rawValue;
    _value;
    getSignal;
    setSignal;
    constructor(value) {
        const [getSignal, setSignal, raw] = createSignal(value);
        this._rawValue = raw;
        this.getSignal = getSignal;
        this.setSignal = setSignal;
        this._value = getSignal();
    }
    get value() {
        return this.getSignal();
    }
    set value(newValue) {
        this.setSignal(newValue);
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
 * 判断对象是否为 ref
 * @note vue 实现这个函数有点low，随便定义一个对象就可以判断
 * @param ref
 */
function isRef(ref) {
    return ref && !!ref[ISREF];
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
    [ISREF] = true;
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
        this[ISREF] = isRef;
        this._get = get;
        this._set = set;
    }
    get value() {
        return this[ISREF] ? super.value : this._get();
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

class ReactiveEffect {
    fn;
    constructor(fn) {
        this.fn = fn;
    }
}

class ComputedRefImpl {
    __v_isReadonly = true;
    [ISREF] = true;
    _cacheable = true;
    _dirty = true;
    computed;
    _setter;
    constructor(getter, setter) {
        this.computed = new ReactiveEffect(getter);
        this._setter = setter;
    }
    get value() {
        return this.computed.fn();
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
        return new ComputedRefImpl(option);
    }
    // @ts-ignore
    return new ComputedRefImpl(option.get, option.set);
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
        if (isMemoryObject(value)) {
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
    };
}
/**
 * 立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行
 * @param cb
 * @returns stop() 取消监听
 */
function watchEffect(cb) {
    let cleanup = false;
    let lock = false;
    binding(() => {
        if (cleanup)
            return true;
        cb((cleanupFn) => {
            lock && cleanupFn(); // 第一次不执行
            lock = true;
        });
    });
    return () => {
        cleanup = true;
    };
}

/**
 * 可以直接赋值给 dom 节点
 * @param value
 * @returns
 */
function isAssignmentValueToNode(value) {
    return ['string', 'number'].includes(typeof value) && value !== '';
}
/**
 * 可进行响应式改变的属性
 * @param attr
 */
function isReactiveChangeAttr(attr) {
    return !/^on/.test(attr);
}
/**
 * 是否为一个真实 dom 对象
 * @param o
 * @returns
 */
function isRealNode(o) {
    return isObject(o) && isString(o.tag);
}
/**
 * 是否为一个组件
 * @param o
 * @returns
 */
function isComponent(tag) {
    return isFunction(tag) && !isFragment(tag);
}
/**
 * 是否为一个类声明组件
 * @param o
 * @returns
 */
function isClassComponent(comp) {
    return isClass(comp) && comp.prototype && comp.prototype.render;
}
/**
 * 不进行渲染的值
 * @param value
 * @returns
 */
function noRenderValue(value) {
    return [void 0, null, '', true, false].includes(value);
}
/**
 * 连接 class
 * @param args 剩余参数，类名
 * @returns
 */
function joinClass(...args) {
    const arr = args.filter(val => isAssignmentValueToNode(val));
    return arr.join(' ').trim().replace(/\s+/, ' ');
}
// #region 减少打包代码体积
/**
 * 创建文本节点
 * @param text
 * @returns
 */
function createTextNode(text) {
    return document.createTextNode(text);
}
function appendChild(dom, child) {
    dom.appendChild(child);
}
// #endregion

function h(tag, attrs, ...children) {
    const tree = {
        tag,
        attrs: attrs || {},
        children,
    };
    // 对组件做一些处理
    if (isComponent(tree.tag)) {
        // 高阶组件 props 传递
        if (len(tree.children) === 0 && tree.attrs.children) {
            tree.children = tree.attrs.children;
        }
    }
    return tree;
}
function Fragment({ children }) {
    return children;
}
const FragmentMark = Symbol('Fragment');
Fragment.prototype[FragmentMark] = FragmentMark;
/**
 * 是否是一个片段节点
 * @param tag
 * @returns
 */
function isFragment(tag) {
    // @ts-ignore
    return isFunction(tag) && tag.prototype && tag.prototype[FragmentMark] === FragmentMark;
}

const compTreeMap = new CustomWeakMap();
/**
 * 过滤掉元素，对组件进行收集
 * @param children
 * @param collect  递归参数，无需传递
 * @returns
 */
function filterElement(children, collect = []) {
    customForEach(children, tree => {
        if (!isObject(tree))
            return;
        if (isComponent(tree.tag)) {
            collect.push({ comp: tree.tag, props: objectAssign(tree.attrs, { children }) });
            customForEach(tree.children, val => {
                if (isComponent(val)) {
                    collect.push({ comp: val, props: {} });
                }
            });
        }
        else if (isAssignmentValueToNode(tree.tag)) {
            filterElement(tree.children, collect);
        }
    });
    return collect;
}
/**
 * 获取一个组件下所有的子组件
 * @param comp    组件
 * @param collect 递归参数，无需传递
 * @returns
 */
function getSubComponent(comp, collect = []) {
    const arr = compTreeMap.get(comp) || [];
    collect.push(...arr);
    customForEach(arr, val => {
        const arr = getSubComponent(val.comp);
        collect.push(...arr);
    });
    return collect;
}

let currentComp = null;
/**
 * 收集实例数据
 * @param comp
 * @param attrs
 * @param children
 */
function recordCurrentComp(comp) {
    currentComp = comp;
}
let currentExportData = null;
/**
 * 定义组件数据出口
 * @param data
 */
function defineExpose(data) {
    currentExportData = data;
}
/**
 * 收集组件导出数据
 * @param comp
 * @param attrs
 * @param children
 */
function collectExportsData(comp, attrs) {
    currentComp = comp;
    if ('ref' in attrs) {
        attrs.ref.value = currentExportData;
    }
    currentExportData = null;
}

/**
 * 当上锁时，所有的钩子都将无法注册
 */
let hookLock = false;
/**
 * 设置锁开关
 * @param bool
 */
function setLock(bool) {
    hookLock = bool;
}

const collect$1 = [];
let isBeforeMount = false;
/**
 * 注册一个 onBeforeMount 钩子
 * @param fn
 */
function onBeforeMount(fn) {
    if (hookLock)
        return;
    if (isBeforeMount) {
        fn();
        return;
    }
    collect$1.push(fn);
}
/**
 * 执行所有 onBeforeMount 钩子
 */
function triggerBeforeMount() {
    customForEach(collect$1, fn => fn());
    collect$1.length = 0;
    isBeforeMount = true;
}

const collect = [];
let isMounted = false;
/**
 * 注册一个 onMounted 钩子
 * @param fn
 */
function onMounted(fn) {
    if (hookLock)
        return;
    if (isMounted) {
        nextTick(fn);
        return;
    }
    collect.push(fn);
}
/**
 * 执行所有 onMounted 钩子
 */
function triggerMounted() {
    customForEach(collect, fn => fn());
    collect.length = 0;
    isMounted = true;
}

const map$1 = new CustomWeakMap();
/**
 * 注册 onBeforeUnmount 钩子
 * @param comp 组件名
 * @param fn
 * @returns
 */
function onBeforeUnmount(fn) {
    if (hookLock)
        return;
    const arr = map$1.get(currentComp) || [];
    const isExist = arr.some(func => func === fn);
    if (isExist)
        return;
    arr.push(fn);
    map$1.set(currentComp, arr);
}
/**
 * 执行对应的 onBeforeUnmount 钩子
 * @param comp 组件名
 */
function triggerBeforeUnmount(comp) {
    const keys = getSubComponent(comp).map(val => val.comp);
    keys.unshift(comp);
    const funcs = [];
    customForEach(keys, key => {
        const arr = map$1.get(key) || [];
        funcs.push(...arr);
        map$1.delete(key);
    });
    customForEach(funcs, func => func());
}

const map = new CustomWeakMap();
/**
 * 注册 onUnmounted 钩子
 * @param comp 组件名
 * @param fn
 * @returns
 */
function onUnmounted(fn) {
    if (hookLock)
        return;
    const arr = map.get(currentComp) || [];
    const isExist = arr.some(func => func === fn);
    if (isExist)
        return;
    arr.push(fn);
    map.set(currentComp, arr);
}
/**
 * 执行对应的 onUnmounted 钩子
 * @param comp 组件名
 */
function triggerUnmounted(comp) {
    const keys = getSubComponent(comp).map(val => val.comp);
    keys.unshift(comp);
    const funcs = [];
    customForEach(keys, key => {
        const arr = map.get(key) || [];
        funcs.push(...arr);
        map.delete(key);
    });
    customForEach(funcs, func => func());
}

class Static {
    config;
    constructor(config) {
        this.config = config;
    }
    /**
     * 树形结构拦截
     * @param tree
     */
    intercept(tree) {
        return tree;
    }
    /**
     * 服务端渲染函数
     * @param tree
     * @returns
     */
    renderToString(tree) {
        setLock(true);
        const html = this.createHTML(tree);
        setLock(false);
        return html;
    }
    /**
     * 创建 innerHTML，用于服务端渲染
     * @param tree
     */
    createHTML(tree) {
        const { tag, attrs, children } = this.intercept(tree);
        // 节点片段
        if (isFragment(tag)) {
            const props = objectAssign(attrs, { children });
            const h = tag(props);
            return this.createHTMLFragment(h);
        }
        // 组件
        if (isComponent(tag)) {
            if (isClassComponent(tag)) {
                // @ts-ignore
                const t = new tag({ ...attrs, children });
                return this.createHTML(t.render.bind(t));
            }
            const props = objectAssign(attrs, { children });
            const newTree = tag(props);
            return this.createHTML(newTree);
        }
        // 属性
        let attrStr = '';
        for (const attr in attrs) {
            if (attr.startsWith('on') || ['ref', 'created'].includes(attr))
                continue;
            let value = isFunction(attrs[attr]) && isReactiveChangeAttr(attr) ? attrs[attr]() : attrs[attr];
            if (isString(tag) && ['innerHTML', 'innerText', 'textContent'].includes(attr)) {
                children[0] = value;
                continue;
            }
            if (attr === 'className') {
                value && (attrStr += ` class="${joinClass(...[value].flat())}"`);
                continue;
            }
            // 对样式单独做下处理
            if (attr === 'style' && isObject(value)) {
                for (const key in value) {
                    if (isFunction(value[key])) { // 响应式数据
                        value[key] = value[key]();
                    }
                }
                value = '"' + JSON.stringify(value).slice(1, -1).replace(/"/g, '').replace(/,/g, ';') + '"';
            }
            attrStr += ` ${attr}="${value}"`;
        }
        // 子节点
        const subNodeStr = this.createHTMLFragment(children);
        return `<${tag}${attrStr}>${subNodeStr}</${tag}>`;
    }
    /**
     * 创建 innerHTML 片段
     * @param children
     * @returns
     */
    createHTMLFragment(children) {
        let text = '';
        customForEach(children, val => {
            // 原始值
            if (isAssignmentValueToNode(val)) {
                text += val.toString();
                return;
            }
            // 节点片段
            if (isArray(val)) {
                text += this.createHTMLFragment(val);
                return;
            }
            // 响应式数据
            if (isFunction(val)) {
                const value = val();
                text += this.createHTMLFragment([value]);
                return;
            }
            // 节点 || 组件 || 虚拟节点
            if (isObject(val)) {
                text += this.createHTML(val);
                return;
            }
            printWarn(`renderToString: 不支持 ${val} 值渲染`);
        });
        return text;
    }
}

class Element extends Static {
    constructor(option) {
        super(option);
    }
    /**
     * 创建组件虚拟 DOM 树的函数
     * @param param0
     * @returns
     */
    render(tree) {
        const dom = this.createElement(tree);
        // 执行钩子函数
        triggerBeforeMount();
        nextTick(triggerMounted);
        return dom;
    }
    /**
     * 创建元素
     * @param tree
     * @param
     * @returns
     */
    createElement(tree) {
        const { tag, attrs, children } = this.intercept(tree);
        // 节点
        if (isString(tag)) {
            return this.createRealNode(tag, attrs, children);
        }
        // 节点片段
        if (isFragment(tag)) {
            return this.createNodeFragment(children);
        }
        // 组件
        if (isComponent(tag)) {
            return this.createComponent(tag, attrs, children);
        }
    }
    /**
     * 组件生成节点
     * @param tag
     * @param attrs
     * @param children
     * @returns
     */
    createComponent(tag, attrs, children) {
        recordCurrentComp(tag);
        // 类组件
        if (isClassComponent(tag)) {
            // @ts-ignore
            const t = new tag({ ...attrs, children });
            tag = t.render.bind(t);
        }
        // 组件
        const props = objectAssign(attrs, { children });
        const tree = tag(props);
        collectExportsData(tag, attrs);
        if (isAssignmentValueToNode(tree)) { // 可能直接返回字符串数字
            return createTextNode(tree);
        }
        compTreeMap.set(tag, filterElement([tree, ...tree.children])); // 收集组件
        return this.createElement(tree);
    }
    /**
     * 创建真实节点
     * @param tag
     * @param attrs
     * @param children
     * @returns
     */
    createRealNode(tag, attrs = {}, children = ['']) {
        const el = document.createElement(tag);
        customForEach(children, val => {
            this.intercept(val);
            if (isFunction(val)) {
                const fragment = this.createNodeFragment([val]);
                appendChild(el, fragment); // 响应式数据交给节点片段去处理
            }
            else {
                this.#nodeMount(el, val);
            }
        });
        // attrs 赋值
        for (const attr in attrs) {
            this.#attrAssign(el, attr, attrs[attr]);
        }
        // 对样式单独处理
        if (attrs.style && isObject(attrs.style)) {
            for (const prop in attrs.style) {
                const value = attrs.style[prop];
                if (isFunction(value)) {
                    binding(() => el.style[prop] = value());
                }
                else {
                    el.style[prop] = value;
                }
            }
        }
        return el;
    }
    /**
     * 创建节点片段
     * @param children
     * @returns
     */
    createNodeFragment(children) {
        const fragment = document.createDocumentFragment();
        customForEach(children, val => {
            this.intercept(val);
            if (isFunction(val)) {
                this.#reactivityNode(fragment, val); // 响应式数据挂载
            }
            else {
                this.#nodeMount(fragment, val);
            }
        });
        return fragment;
    }
    /**
     * 节点挂载
     * @param el
     * @param val
     */
    #nodeMount(el, val) {
        if (noRenderValue(val))
            return;
        // 节点片段
        if (isArray(val)) {
            const fragment = this.createNodeFragment(val);
            appendChild(el, fragment);
            return;
        }
        if (isAssignmentValueToNode(val) || isObject(val)) {
            const node = this.createNode(val);
            appendChild(el, node);
            return;
        }
        printWarn(`render: 不支持 ${val} 值渲染`);
    }
    /**
     * 创建一个节点
     * @param value
     * @returns
     */
    createNode(value) {
        // 文本节点
        if (isAssignmentValueToNode(value)) {
            return createTextNode(value);
        }
        // 节点
        if (isRealNode(value)) {
            return this.createRealNode(value.tag, value.attrs, value.children);
        }
        // 节点片段
        if (isFragment(value.tag)) {
            return this.createNodeFragment(value.children);
        }
        // 组件
        if (isComponent(value.tag)) {
            return this.createComponent(value.tag, value.attrs, value.children);
        }
    }
    /**
     * 属性赋值
     * @param el
     * @param attr
     * @param value
     */
    #attrAssign(el, attr, value) {
        // 自定义属性
        if (attr === 'ref' && isObject(value)) {
            value.value = el;
            return;
        }
        if (attr === 'created' && isFunction(value)) {
            value(el);
            return;
        }
        // 一般属性赋值
        let assgin = (val) => el[attr] = val;
        // 特殊属性处理
        if (attr === 'className') {
            assgin = (val) => el[attr] = joinClass(...[val].flat());
        }
        else if (attr.startsWith('data-')) {
            assgin = (val) => el.dataset[attr.slice(5)] = val;
        }
        // 响应式数据
        if (isReactiveChangeAttr(attr) && isFunction(value)) {
            binding(() => assgin(value()));
        }
        else {
            assgin(value);
        }
    }
    /**
     * 响应式节点变化
     * @param fragment
     * @param func
     */
    #reactivityNode(fragment, func) {
        let backupNodes = [];
        let lockFirstRun = true; // 锁：第一次运行
        let parent = null;
        const textNode = createTextNode(''); // 用于记录添加位置
        appendChild(fragment, textNode);
        binding(() => {
            let value = func();
            if (value && isObject(value) && isFragment(value.tag)) {
                printWarn('不支持响应式节点片段渲染');
                return;
            }
            if (!isArray(value))
                value = [value];
            value = value.filter(val => !noRenderValue(val));
            let i = 0;
            while (i < len(value)) {
                let val = value[i];
                const index = lookupBackupNodes(backupNodes, i);
                if (index >= 0) { // 节点已经存在
                    if (isEquals(val, backupNodes[index].tree)) { // 任何数据都没有变化
                        i++;
                        continue;
                    }
                    // 节点替换，重新备份
                    const node = this.createNode(val);
                    if (!node) { // 创建节点失败，有可能原节点被删除
                        value.splice(index, 1);
                        i++;
                        continue;
                    }
                    const originTree = backupNodes[index].tree;
                    isComponent(originTree.tag) && triggerBeforeUnmount(originTree.tag); // 组件卸载之前
                    backupNodes[index].node.parentElement.replaceChild(node, backupNodes[index].node);
                    if (isComponent(originTree.tag)) { // 组件卸载之后
                        const comp = originTree.tag;
                        triggerUnmounted(comp);
                        compTreeMap.delete(comp);
                    }
                    backupNodes[index].tree = val;
                    backupNodes[index].node = node;
                }
                else { // 节点不存在，追加节点
                    const node = this.createNode(val);
                    if (!node) { // 创建节点失败，有可能原节点被删除
                        i++;
                        continue;
                    }
                    if (lockFirstRun) {
                        appendChild(fragment, node);
                    }
                    else if (len(backupNodes) === 0) {
                        parent ??= textNode.parentElement;
                        parent.insertBefore(node, textNode.nextSibling);
                    }
                    else {
                        const prevNode = backupNodes[len(backupNodes) - 1].node;
                        const lastNode = prevNode.nextSibling;
                        prevNode.parentElement.insertBefore(node, lastNode);
                    }
                    backupNodes.push({ key: i, tree: val, node });
                }
                i++;
            }
            // 检查有没有要删除的节点
            if (len(backupNodes) > len(value)) {
                for (let i = len(value); i < len(backupNodes); i++) {
                    const originTree = backupNodes[i].tree;
                    isComponent(originTree.tag) && triggerBeforeUnmount(originTree.tag); // 组件卸载之前
                    // @ts-ignore 节点片段无法删除
                    backupNodes[i].node.remove();
                    if (isComponent(originTree.tag)) { // 组件卸载之后
                        const comp = originTree.tag;
                        triggerUnmounted(comp);
                        compTreeMap.delete(comp);
                    }
                }
                backupNodes.splice(len(value), len(backupNodes) - len(value));
            }
            lockFirstRun = false;
        });
    }
}
/**
 * 查询备份数据中是否存在（二分）
 * @param arr
 * @param value
 * @returns
 */
function lookupBackupNodes(arr, value) {
    let start = 0;
    let end = len(arr) - 1;
    while (start <= end) {
        const midden = Math.ceil((start + end) / 2);
        const val = arr[midden];
        if (value === val.key) {
            return midden;
        }
        else if (value < val.key) { // 在左边
            end = midden - 1;
        }
        else if (value > val.key) { // 在右边
            start = midden + 1;
        }
    }
    return -1;
}

class App extends Element {
    constructor(config) {
        super(config);
        this.config = config;
    }
    use(plugin) {
        plugin.install(this);
        return this;
    }
    version = '0.6.4';
    /**
     * 数据拦截
     */
    intercept(tree) {
        if (tree && isString(tree.tag)) {
            const globalComp = this.#compMap.get(tree.tag);
            if (globalComp) {
                tree.tag = globalComp;
            }
        }
        return tree;
    }
    // #region 全局组件
    #compMap = new Map();
    /**
     * 注册全局组件
     * @param name
     * @param Comp
     */
    component(name, Comp) {
        this.#compMap.set(name, Comp);
        return this;
    }
}
/**
 * 创建应用
 * @param option
 * @returns
 */
function createApp(option = {}) {
    return new App(option);
}

/**
 * 渲染为 DOM 节点
 * @param tree
 * @returns
 */
function render(tree) {
    const app = new Element();
    return app.render(tree);
}
/**
 * 渲染成字符串
 * @param tree
 * @returns
 */
function renderToString(tree) {
    const app = new Static();
    return app.renderToString(tree);
}
/**
 * 使用组件
 * @param Comp  组件函数
 * @param props 组件参数
 * @returns HTMLElement
 */
function useComponent(Comp, props) {
    return render(h(Comp, props));
}

export { Fragment, RefImpl, binding, computed, createApp, createSignal, customRef, defineExpose, h, isProxy, isReactive, isRef, joinClass, markRaw, nextTick, onBeforeMount, onBeforeUnmount, onMounted, onUnmounted, reactive, readonly, recycleDepend, ref, render, renderToString, toRaw, toRef, toRefs, unref, useComponent, watch, watchEffect };
