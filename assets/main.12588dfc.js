(()=>{"use strict";function t(t){return Object.prototype.toString.call(t).slice(8,-1).toLowerCase()}function e(t){return"object"==typeof t}function n(t){return["string","number"].includes(typeof t)&&""!==t}let r=null;const o=new WeakMap;function l(t){r=t,t(),r=null}function c(t){const e=o.get(t);e&&e.forEach(((n,r)=>{const l=n();"boolean"==typeof l&&l&&(e.splice(r,1),o.set(t,e))}))}const u=new WeakMap,a={RAW:Symbol("__v_raw"),IS_READONLY:Symbol("__v_isReadonly")};function i(t){return!e(t)||u.get(t)?t:new Proxy(t,{get(t,n,l){if(n===a.RAW)return t;!function(t){const e=o.get(t)||[];r&&e.push(r),o.set(t,e)}(t);const c=Reflect.get(t,n,l);return e(c)?i(c):c},set(t,e,n,r){const o=Reflect.get(t,e,r),l=Reflect.set(t,e,n,r);return t[a.IS_READONLY]?o:(l&&o!==n&&c(t),l)},deleteProperty(t,e){const n=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}(t,e),r=Reflect.deleteProperty(t,e);return n&&r&&c(t),r}})}class s{__v_isRef=!0;__v_isShallow=!1;_rawValue;_value;constructor(t){this._rawValue=t,this._value=e(t)?i(t):i({value:t})}get value(){return e(this._rawValue)?this._value:this._value.value}set value(t){this._rawValue=t,e(t)?this._value=t:this._value.value=t}}function f(t,e,...n){return{tag:t,attrs:e||{},children:n}}function p({children:t}){return t}const d=Symbol("Fragment");function h(t){return"function"==typeof t&&t.prototype[d]===d}function y(e){return e instanceof Array?function(t){let e=new Array(t.length);for(let n=0;n<e.length;n++)e[n]=y(t[n]);return e}(e):"object"===t(e)?function(t){let e={},n=Object.getOwnPropertyNames(t);for(let r=0;r<n.length;r++)e[n[r]]=y(t[n[r]]);return e}(e):e}function g(e,n={},r=[]){if("function"==typeof e&&!h(e)){const t=e(y(Object.assign({},n,{children:r})));return g(t.tag,t.attrs,t.children)}const o=[];return r.forEach((e=>{if("object"===t(e)){const t=g(e.tag,e.attrs,e.children);o.push(t)}else o.push(e)})),{tag:e,attrs:n,children:o}}function _(t,e,n){return"string"==typeof t?v(t,e,n):h(t)?m(n):void 0}function v(e,r={},o=[""]){if(h(e))return _(e,r,o);const c=document.createElement(e);o.forEach((e=>{if(n(e)){const t=document.createTextNode(e);return t.nodeValue=e,void c.appendChild(t)}if("function"!=typeof e)if(e instanceof Array){const t=m(e);c.appendChild(t)}else if("object"!==t(e));else{const t=v(e.tag,e.attrs,e.children);c.appendChild(t)}else{const t=m([e]);c.appendChild(t)}}));for(const t in r)c[t]=r[t];if(r.style&&r.style instanceof Object)for(const t in r.style){const e=r.style[t];"function"==typeof e?l((()=>c.style[t]=e())):c.style[t]=e}return c}function m(e){const r=document.createDocumentFragment();return e.forEach((e=>{if(n(e)){const t=document.createTextNode(e);return t.nodeValue=e,void r.appendChild(t)}if("function"==typeof e){const o=document.createTextNode("");let c=null;return l((()=>{const l=e();if(n(l))o.nodeValue=l.toString(),null!==c&&c.parentElement.replaceChild(o,c),c=o;else if("object"===t(l)){const t=_(l.tag,l.attrs,l.children);c?c.parentElement.replaceChild(t,c):r.appendChild(t),c=t}else l instanceof Array&&console.warn("暂不支持直接返回一个数组，请包裹一层标签")})),void r.appendChild(o)}if(e instanceof Array){const t=m(e);r.appendChild(t)}else if("object"!==t(e));else{const t=v(e.tag,e.attrs,e.children);r.appendChild(t)}})),r}p.prototype[d]=d;const b="demo__bac49";function w(t){return f("div",null,f("p",null,"子组件"),f("p",null,"props: ",t.count),f("p",null,t.children))}document.getElementById("root").appendChild(function({tag:t,attrs:e,children:n}){const r=g(t,e,n);return _(r.tag,r.attrs,r.children)}(f((function(){const t=new s(1);return f(p,null,"父组件",f("h1",{className:b,style:{transform:()=>`translateX(${t.value}px)`,color:"red"}},(()=>t.value)),f(w,{count:()=>t.value},f("p",null,"插槽1"),f("p",null,"插槽2")),f("button",{onclick:()=>t.value++},"click"))}),null)))})();