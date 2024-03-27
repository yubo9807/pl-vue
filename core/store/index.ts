
import { states } from './define';
import type { App } from '../vdom';

export { defineStore } from './define';

export function createStore() {
  return {
    install(app: App) {
      app.$store = {
        state: states,
      };
    }
  }
}