import { createStore } from "~/pvue/store";

const state = {
  count: 0,
}

const actions = {
  setCount(num: number) {
    state.count = num;
  },
}

export default createStore(state, actions);
