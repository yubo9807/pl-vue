import { isReactive, markRaw, reactive, toRaw, isProxy } from "./reactivity/reactive";
import { customRef, isRef, ref, toRef, toRefs, unref } from "./reactivity/ref";
import { readonly } from "./reactivity/readonly";
import { computed } from "./reactivity/computed";
import { watch, watchEffect } from "./watch";
import { h, hFragment } from "./h";


const count = ref(1);
const text = debounceRef('');

const root = hFragment([
  h('div', { style: { transform: () => `translateX(${count.value}px)`}}, () => count.value),
  h('button', { onclick: () => count.value++ }, 'click'),
  h('div', {}, [
    h('input', { oninput: val => text.value = val.target.value }),
    h('span', {}, () => text.value),
  ]),
])

document.getElementById('root').appendChild(root);


function debounceRef<T>(value: T, delay = 300) {
  let timer = null;
  return customRef((track, trigger) => ({
    get() {
      track();
      return value;
    },
    set(val: T) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        value = val;
        trigger();
      }, delay)
    }
  }))
}

const unwatch = watch(() => count.value, value => {
  if (value > 5) unwatch();
  console.log(value)
})




// const aRef = toRef(obj, 'a');
// aRef.value = 123
// obj.a = 456
// console.log(aRef.value, obj)

// const r = toRaw(obj)
// r.a = 234
// obj.a = 456
// console.log(r, obj)

// const o = readonly({ a: 1 })
// o.a = 111
// delete o.a
