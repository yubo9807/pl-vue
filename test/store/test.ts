import { defineStore } from "~/core/store"

const state = {
  count: 1
}

const actions = {
  add() {
    state.count++
  }
}

export default defineStore({
  id: 'test',
  state,
  actions,
});
