import { isReactive, markRaw, reactive, toRaw, binding, isProxy } from "./reactivity/reactive";
import { customRef, isRef, ref, toRef, toRefs, unref } from "./reactivity/ref";
import { readonly } from "./reactivity/readonly";
import { computed } from "./reactivity/computed";
import { watch } from "./watch";

const obj = {
  a: 1,
  b: {
    c: 3,
    d: {
      e: 5
    },
  }
};
// markRaw(obj);
const o = reactive(obj);



const value = document.getElementById('value');
const btn = document.getElementById('btn');


const a = ref(1);
const d = computed(() => a.value);
binding(() => value.innerText = d.value);

const unWatch = watch(() => a.value, (value, oldValue) => {
  console.log(value, oldValue)
}, { immediate: true })

btn.onclick = () => {
  a.value ++;
  if (a.value >= 5) {
    unWatch();
  }
}





// const input: any = document.getElementById('input');
// const c = debounceRef('');
// binding(() => {
//   input.value     = c.value;
//   value.innerText = c.value;
// });
// input.oninput = e => {
//   c.value = e.target.value
// }

// function debounceRef(value, delay = 300) {
//   let timer = null;
//   return customRef((track, trigger) => ({
//     get() {
//       track();
//       return value;
//     },
//     set(val) {
//       clearTimeout(timer);
//       timer = setTimeout(() => {
//         value = val;
//         trigger();
//       }, delay)
//     }
//   }))
// }




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
