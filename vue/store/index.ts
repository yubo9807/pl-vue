import { reactive } from "../reactivity/reactive";
import { watch } from "../reactivity/watch";
import { nextTick } from "../utils/next-tick";
import { clone } from "../utils/object";
import { AnyObj } from "../utils/type";

const actionFlag = Symbol('action');
function isAction(func: unknown) {
  return typeof func === 'function' && func.prototype[actionFlag] === actionFlag;
}

class Stroe<S, A> {
  state:   S
  actions: A
  #lock = true;
  constructor(state: S, actions: A) {
    this.state = reactive(clone(state));

    // 监听数据：若通过直接赋值的方式，恢复到原先的值
    watch(() => this.state, () => {
      if (this.#lock) {  // 上锁时不允许改变任何值
        // 这里也可重置为 watch 回掉中的 oldValue，但在原 vue 中不可以
        this._merge(state);
      }
    }, { deep: true });

    // 包装每个 actions
    (this.actions as AnyObj) = {};
    for (const key in actions) {
      const self = this;
      function func(...args: unknown[]) {
        self.#lock = false;                   // 解锁
        const result = actions[key as string](...args);
        self._merge(state);
        if (typeof result === 'object' && result[Symbol.toStringTag] === 'Promise') {
          result.then(() => {
            self._merge(state);
            nextTick(() => self.#lock = true);
          })
        } else {
          self._merge(state);
          nextTick(() => self.#lock = true);  // 重新上锁
        }
      }
      func.prototype[actionFlag] = actionFlag;
      this.actions[key as string] = func;
    }
  }

  /**
   * 合并 state 数据
   * @param state 
   */
  _merge(state: S) {
    const targetKsys = Object.keys(state);
    for (const prop in state) {
      this.state[prop] = state[prop];
    }
    for (const key in this.state) {
      if (isAction(this.state[key])) continue;
      !targetKsys.includes(key) && delete this.state[key];
    }
  }

  get store() {
    this.#lock = false;
    const store = Object.assign(this.state, this.actions);
    nextTick(() => this.#lock = true);
    return store;
  }

}


/**
 * 创建一个 Store
 * @param state 
 * @param actions 
 * @returns 
 */
export function createStore<S extends object, A extends object>(state: S, actions: A): () => S & A {
  return () => {
    const s = new Stroe(state, actions);
    return s.store;
  }
}
