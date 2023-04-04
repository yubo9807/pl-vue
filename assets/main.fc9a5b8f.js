(()=>{"use strict";function e(e){return Object.prototype.toString.call(e).slice(8,-1).toLowerCase()}function t(t){return["object","array"].includes(e(t))}function n(e,t){if("object"==typeof e&&"object"==typeof t){const o=Object.keys(e),r=Object.keys(t);if(o.length!==r.length)return!1;for(const c of o){if(!r.includes(c))return!1;if(!n(e[c],t[c]))return!1}return!0}return e===t}let o=null;const r=new WeakMap;function c(e){o=e,e(),o=null}function l(e){const t=r.get(e);t&&t.forEach(((n,o)=>{const c=n();"boolean"==typeof c&&c&&(t.splice(o,1),r.set(e,t))}))}const i=new WeakMap,s={RAW:Symbol("__v_raw"),IS_READONLY:Symbol("__v_isReadonly")};function u(e){return!t(e)||i.get(e)?e:new Proxy(e,{get(e,n,c){if(n===s.RAW)return e;!function(e){const t=r.get(e)||[],n=t.some((e=>o===e));o&&!n&&t.push(o),r.set(e,t)}(e);const l=Reflect.get(e,n,c);return t(l)?u(l):l},set(e,t,n,o){const r=Reflect.get(e,t,o),c=Reflect.set(e,t,n,o);return e[s.IS_READONLY]?r:(c&&r!==n&&l(e),c)},deleteProperty(e,t){const n=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}(e,t),o=Reflect.deleteProperty(e,t);return n&&o&&l(e),o}})}class a{__v_isRef=!0;__v_isShallow=!1;_rawValue;_value;constructor(e){this._rawValue=e,this._value=t(e)?u(e):u({value:e})}get value(){return t(this._rawValue)?this._value:this._value.value}set value(e){this._rawValue=e,t(e)?this._value=e:this._value.value=e}}function f(e,t,...n){return{tag:e,attrs:t||{},children:n}}function d({children:e}){return e}const p=Symbol("Fragment");function h(e){return"function"==typeof e&&e.prototype[p]===p}d.prototype[p]=p;const g=[];let y=!1;function m(){g.forEach((e=>{e()})),g.length=0,y=!0}function v(e){if(void 0!==typeof Promise)Promise.resolve().then(e);else if(void 0!==typeof MutationObserver){const t=new MutationObserver(e),n=document.createTextNode("0");t.observe(n,{characterData:!0}),n.data="1"}else void 0!==typeof process?process.nextTick(e):setTimeout(e,0)}function b(e){return["string","number"].includes(typeof e)&&""!==e}function _(e){return["className","innerHTML","innerText","textContent"].includes(e)}function w(t){return"object"===e(t)&&("string"==typeof t.tag||h(t.tag))}function j(e){return!h(e)&&"function"==typeof e}function C(t){return t instanceof Array?function(e){let t=new Array(e.length);for(let n=0;n<t.length;n++)t[n]=C(e[n]);return t}(t):"object"===e(t)?function(e){let t={},n=Object.getOwnPropertyNames(e);for(let o=0;o<n.length;o++)t[n[o]]=C(e[n[o]]);return t}(t):t}function E(t,n={},o=[]){if("function"==typeof t&&!h(t)){const e=t(C(Object.assign({},n,{children:o})));return E(e.tag,e.attrs,e.children)}const r=[];return o.forEach((t=>{if("object"===e(t)){const e=E(t.tag,t.attrs,t.children);r.push(e)}else r.push(t)})),{tag:t,attrs:n,children:r}}function O(e,t,n){return"string"==typeof e?x(e,t,n):h(e)?N(n):void 0}function x(t,n={},o=[""]){if(h(t))return O(t,n,o);const r=document.createElement(t);o.forEach((t=>{if(b(t)){const e=document.createTextNode(t);return e.nodeValue=t,void r.appendChild(e)}if("function"!=typeof t)if(t instanceof Array){const e=N(t);r.appendChild(e)}else if(w(t)){const e=x(t.tag,t.attrs,t.children);r.appendChild(e)}else if("object"===e(t)&&j(t.tag)){const e=R(t);r.appendChild(e)}else console.warn(`render: 不支持 ${t} 值渲染`);else{const e=N([t]);r.appendChild(e)}}));for(const e in n){const t=n[e];r[e]=t,"ref"===e&&(t.value=r),"function"==typeof t&&_(e)&&c((()=>{r[e]=t()}))}if(n.style&&n.style instanceof Object)for(const e in n.style){const t=n.style[e];"function"==typeof t?c((()=>r.style[e]=t())):r.style[e]=t}return r}function N(t){const o=document.createDocumentFragment();return t.forEach((t=>{if(b(t)){const e=document.createTextNode(t);return e.nodeValue=t,void o.appendChild(e)}if("function"==typeof t){let e=[],r=0,l=null;const i=document.createTextNode("");return o.appendChild(i),void c((()=>{let c=t();if(c instanceof Array?c.length>50&&console.warn("渲染子节点过多，有严重的性能问题。建议包裹一层虚拟节点 '<></>'"):c=[c],c=c.filter((e=>e)),c.forEach(((t,c)=>{const s=c,u=e.findIndex((e=>e.key===s));if(u>=0){if(n(t,e[u].tree))return;const o=R(t);e[u].node.parentElement.replaceChild(o,e[u].node),e[u].tree=t,e[u].node=o}else{const n=R(t);if(0===r)o.appendChild(n);else if(0===e.length)l??=i.parentElement,l.insertBefore(n,i.nextSibling),i.remove();else{const t=e[e.length-1].node,o=t.nextSibling;t.parentElement.insertBefore(n,o)}e.push({key:s,tree:t,node:n})}})),e.length>c.length)for(let t=c.length;t<e.length;t++)e[t].node.remove(),e.splice(t,1);r++}))}if(t instanceof Array){const e=N(t);o.appendChild(e)}else if(w(t)){const e=x(t.tag,t.attrs,t.children);o.appendChild(e)}else if("object"===e(t)&&j(t.tag)){const e=R(t);o.appendChild(e)}else console.warn(`render: 不支持 ${t} 值渲染`)})),o}function R(t){if(b(t))return document.createTextNode(t.toString());if(w(t))return O(t.tag,t.attrs,t.children);if("object"===e(t)&&j(t.tag)){const e=E(t.tag,t.attrs,t.children);return O(e.tag,e.attrs,e.children)}}const S="demo__bac49";function T(e){return f("div",null,f("p",null,"子组件"),f("p",null,"props: ",e.count),f("p",null,e.children))}document.getElementById("root").appendChild(function({tag:e,attrs:t,children:n}){const o=E(e,t,n),r=O(o.tag,o.attrs,o.children);if(r instanceof DocumentFragment){const e=r.children[0];v((()=>{e.parentNode&&m()}))}else r instanceof HTMLElement&&v((()=>{r.parentNode&&m()}));return r}(f((function(){const e=new a(1);return f(d,null,"父组件",f("h1",{className:S},(()=>e.value)),f(T,{count:()=>e.value},f("p",null,"插槽1"),f("p",null,"插槽2")),f("button",{onclick:()=>e.value++},"click"))}),null)))})();