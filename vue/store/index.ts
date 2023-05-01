import { reactive } from "../reactivity/reactive";
import { watch } from "../reactivity/watch";
import { nextTick } from "../utils/next-tick";
import { clone } from "../utils/object";
import { AnyObj } from "../utils/type";

const actionFlag = Symbol('action');
function isAction(func) {
  return typeof func === 'function' && func.prototype[actionFlag] === actionFlag;
}

class Stroe<S, A> {
  state:   S
  actions: A
  #lock = true;
  constructor(state: S, actions: A) {
    this.state = reactive(clone(state));

    // 监听数据：若通过直接赋值的方式，恢复到原先的值
    watch(() => this.state, (value, oldValue) => {
      if (this.#lock) {  // 上锁，不允许改变任何值
        for (const prop in oldValue) {
          this.state[prop] = oldValue[prop];
        }
        const keys = Object.keys(oldValue);
        for (const prop in value) {
          !keys.includes(prop) && delete this.state[prop];
        }
      }
    }, { deep: true });

    // 包装每个 actions
    (this.actions as AnyObj) = {};
    for (const key in actions) {
      const self = this;
      function func(...args) {
        self.#lock = false;                   // 解锁
        const result = (actions[key] as Function)(...args);
        self.#merge(state);
        if (typeof result === 'object' && result[Symbol.toStringTag] === 'Promise') {
          result.then(res => {
            self.#merge(state);
            nextTick(() => self.#lock = true);
          })
        } else {
          self.#merge(state);
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
  #merge(state: S) {
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

const map = new WeakMap();

export function createStore<S, A>(state: S, actions: A): () => S & A {
  return () => {
    if (typeof state !== 'object') {
      console.warn(`state 类型必须为 object`);
      return {}
    };
    const store = map.get(state);
    if (store) {
      return store;
    } else {
      const s = new Stroe(state, actions);
      map.set(state, s.store);
      return s.store;
    }
  }
}
