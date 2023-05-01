import { createStore } from "~/vue/store";

const state = {
  count: 0,
}

const actions = {
  setCount(num: number) {
    // state.count ++;
    return Object.assign({}, state, { count: num });
  }
}

export default createStore(state, actions);

