(()=>{function u(e){return typeof e=="object"}function h(e,t){return Object.prototype.hasOwnProperty.call(e,t)}var f=null,l=new WeakMap;function p(e){f=e,e(),f=null}var A=new WeakMap,a={RAW:Symbol("__v_raw"),IS_READONLY:Symbol("__v_isReadonly")};function s(e){return!u(e)||A.get(e)?e:new Proxy(e,{get(t,r,o){if(r===a.RAW)return t;let i=l.get(t)||[];f&&i.push(f),l.set(t,i);let n=Reflect.get(t,r,o);return u(n)?s(n):n},set(t,r,o,i){let n=Reflect.get(t,r,i),c=Reflect.set(t,r,o,i);if(t[a.IS_READONLY])return n;if(c&&n!==o){let v=l.get(t);v&&v.forEach(j=>j())}return c},deleteProperty(t,r){let o=h(t,r),i=Reflect.deleteProperty(t,r);if(o&&i){let n=l.get(t);n&&n.forEach(c=>c())}return i}})}function w(e){return!!e[a.RAW]}var y="__v_isRef",b=class{[y]=!0;__v_isShallow=!1;_rawValue;_value;constructor(t){this._rawValue=t,this._value=u(t)?s(t):s({value:t})}get value(){return u(this._rawValue)?this._value:this._value.value}set value(t){this._rawValue=t,u(t)?this._value=t:this._value.value=t}};function x(e){return new b(e)}function m(e){return e&&e[y]}var _=class{fn;constructor(t){this.fn=t}};var d=class{__v_isReadonly=!0;[y]=!0;_cacheable=!0;_dirty=!0;computed;_setter;constructor(t,r){this.computed=new _(t),this._setter=r}get value(){return this.computed.fn()}set value(t){this._setter?this._setter(t):console.warn("Write operation failed: computed value is readonly")}};function O(e){return typeof e=="function"?new d(e):new d(e.get,e.set)}function g(e,t,r={}){let o=null;if(typeof e=="function")o=e();else{if(!m(e)&&!w(e))return()=>{};o=m(e)?e.value:e}r.immediate&&t(o,o);let i=!1;return p(()=>{let n=null;typeof e=="function"?n=e():n=m(e)?e.value:n,o!==n&&!i&&t(n,o),o=n}),()=>{i=!0}}var T={a:1,b:{c:3,d:{e:5}}},ce=s(T),F=document.getElementById("value"),S=document.getElementById("btn"),R=x(1),k=O(()=>R.value);p(()=>F.innerText=k.value);g(R,(e,t)=>{console.log(e,t)},{immediate:!0});S.onclick=()=>{R.value++};})();
