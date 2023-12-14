import { reactive, watch } from "../reactivity";
import { AnyObj, deepClone, nextTick, isFunction, isMemoryObject } from "../utils";

const actionFlag = Symbol('action');
function isAction(func: Function) {
  return isFunction(func) && func.prototype[actionFlag] === actionFlag;
}

type Obj = Record<string, any>

class Stroe<S extends Obj, A extends Obj> {
  state:   S
  actions: A
  constructor(state: S, actions: A) {
    this.state = reactive(deepClone(state));

    // 包装每个 actions
    (this.actions as AnyObj) = {};
    for (const key in actions) {
      const self = this;
      function func(...args: unknown[]) {
        const result = actions[key](...args);
        if (isMemoryObject(result) && result[Symbol.toStringTag] === 'Promise') {
          result.then(res => {
            self._merge(state);
            return res;
          })
        } else {
          self._merge(state);
          return result;
        }
      }

      func.prototype[actionFlag] = actionFlag;
      self.actions[key] = func as any;
    }

    // 合并对象
    Object.assign(this.state, this.actions);  // 将 actions 塞到 state 中
    for (const key in this.actions) {
      Object.defineProperty(this.state, key, {
        writable: false,  // actions 不可被重写
      })
    }

  }

  /**
   * 合并 state 数据
   * @param state 
   */
  _merge(state: S) {
    const newState = deepClone(state);
    const targetKsys = Object.keys(newState);

    // 只对 newState 数据做更改
    for (const prop in newState) {
      this.state[prop] = newState[prop];
    }
    for (const key in this.state) {
      if (isAction(this.state[key])) continue;
      !targetKsys.includes(key) && delete this.state[key];
    }
  }

}


const collectMap: WeakMap<Obj, Obj> = new WeakMap();

/**
 * 创建一个 Store
 * @param state 
 * @param actions 
 * @returns 
 */
export function createStore<S extends Obj, A extends Obj>(state: S, actions: A): () => S & A {
  return () => {
    if (!collectMap.has(state)) {
      const s = new Stroe(state, actions);
      collectMap.set(state, s.state);
    }
    return collectMap.get(state) as S & A;
  }
}
