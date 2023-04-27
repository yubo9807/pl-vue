import { isReactive, markRaw, reactive, toRaw, isProxy } from "./reactivity/reactive";
import { customRef, isRef, ref, toRef, toRefs, unref } from "./reactivity/ref";
import { createSignal } from './reactivity/signal';
import { readonly } from "./reactivity/readonly";
import { computed } from "./reactivity/computed";
import { watch, watchEffect } from "./reactivity/watch";
import { binding } from "./reactivity/depend";
import { nextTick } from './utils/next-tick';
import { initRouter } from './router/init-router';
import { useRoute } from './router/use-route';
import { useRouter } from './router/use-router';

(window as any).vue = {
  isReactive, markRaw, reactive, toRaw, isProxy,
  customRef, isRef, ref, toRef, toRefs, unref,
  createSignal,
  readonly,
  computed,
  watch, watchEffect,
  autoRun: binding,
  nextTick,
  createRouter: initRouter,
  useRoute,
  useRouter,
}
