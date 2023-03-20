import { isReactive, markRaw, reactive, toRaw, isProxy } from "./reactivity/reactive";
import { customRef, isRef, ref, toRef, toRefs, unref } from "./reactivity/ref";
import { readonly } from "./reactivity/readonly";
import { computed } from "./reactivity/computed";
import { watch, watchEffect } from "./watch";
import { h, Fragment, render } from "./h";

const count = ref(0);

const jsx = <div className='wrap'>
  {() => count.value}
  <button onclick={() => count.value ++}>click</button>
  {[1,2,3].map((val) => <span>{val}</span>)}
  {null}
  {0}
  {() => count.value & 1 ? '单数' : '双数'}
</div>

document.getElementById('root').appendChild(render(jsx))