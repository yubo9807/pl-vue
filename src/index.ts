import { isReactive, markRaw, reactive, toRaw, binding } from "./reactivity/reactive";
import { isRef, ref, toRef, toRefs, unref } from "./reactivity/ref";
import { readonly } from "./reactivity/readonly";
import { computed } from "./reactivity/computed";

const obj = {
  a: 1,
  b: {
    c: 3,
    d: 4,
  }
};
// markRaw(obj);
const o = reactive(obj);

// const b = reactive(obj)
// b.a = 123
// delete obj.b

// console.log(c)
const a = ref(1);

// a.value
// console.log(a);

// const c = computed(() => a.value + 123);
// c.value = 1
// console.log(isRef(c))

const value = document.getElementById('value');
const btn = document.getElementById('btn');


binding(() => {
  value.innerText = a.value;
})

btn.onclick = () => {
  a.value ++;
}
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
