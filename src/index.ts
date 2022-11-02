import { reactive, toRaw } from "./reactivity/reactive";
import { ref, toRef, toRefs } from "./reactivity/ref";
import { readonly } from "./reactivity/readonly";
import { computed } from "./reactivity/computed";

const obj = reactive({
  a: 1,
  b: {
    c: 3,
    d: 4,
  }
});

// const aRef = toRef(obj, 'a');
// aRef.value = 123
// obj.a = 456
// console.log(aRef.value, obj)

// const a = toRaw(obj)
// a.a = 234
// obj.a = 456
// console.log(a, obj)


const o = readonly({ a: 1 })
// o.a = 111
// delete o.a

const b = reactive(o)
b.a = 123
console.log(b)

// const a = computed(() => 111);
// a.value = 123

// delete obj.b

// const arr = reactive([ 1, 2, [ 4 ] ]);

// arr[0] = 0
// arr[2][0] = 2

// delete arr[1]

// const a = ref(1);

// a.value
// a.value = 2
