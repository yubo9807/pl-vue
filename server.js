"use strict";var V=Object.defineProperty;var C=(t,n,e)=>n in t?V(t,n,{enumerable:!0,configurable:!0,writable:!0,value:e}):t[n]=e;var u=(t,n,e)=>(C(t,typeof n!="symbol"?n+"":n,e),e);const W=require("http"),M=require("fs"),g=require("path");function P(t){return Object.prototype.toString.call(t).slice(8,-1).toLowerCase()}function p(t){return["object","array"].includes(P(t))}function q(t,n){return Object.prototype.hasOwnProperty.call(t,n)}function F(t){return P(t)==="object"}function z(t){return Array.isArray(t)}function j(t){Promise.resolve().then(t)}function K(){return Number(Math.random().toString().slice(2)).toString(32)}let B=null;const S=new WeakMap;function D(t){(S.get(t)||[]).some(e=>B===e)}function A(t){const n=S.get(t);n&&n.forEach((e,o)=>{e()===!0&&(n.splice(o,1),S.set(t,n))})}const H=new WeakMap,m=new WeakMap,O={RAW:Symbol("__v_raw"),IS_READONLY:Symbol("__v_isReadonly")};function L(t){if(!p(t)||Object.isFrozen(t)||H.get(t))return t;let n=null;return new Proxy(t,{get(e,o,r){if(o===O.RAW)return e;if(p(e[o]))return L(e[o]);const i=Reflect.get(e,o,r);return D(e),i},set(e,o,r,i){if(e[O.IS_READONLY])return!0;if(p(e[o])){const f=e[o],R=new Set;for(const a in r)R.add(a),this.set(f,a,r[a],i[o]);for(const a in f)R.has(a)||this.deleteProperty(f,a);return!0}if(Reflect.get(e,o,i)===r)return!0;const s=Reflect.set(e,o,r,i),y=m.get(e)||new Set;y.add(o);const U=y.size;return m.set(e,y),j(()=>{const f=Reflect.get(e,o,i);s&&f===r&&U===1&&A(e),m.delete(e)}),s},deleteProperty(e,o){const r=Reflect.get(e,o);if(p(r)){for(const s in r)this.deleteProperty(r,s);return!0}const i=q(e,o),c=Reflect.deleteProperty(e,o);return n=o,j(()=>{i&&c&&r!==void 0&&o===n&&(A(e),n=null)}),c}})}function G(t){const n=L({value:t});function e(){return n.value}function o(r){n.value=r}return[e,o]}const J="__v_isRef";var ft;class Y{constructor(n){u(this,ft,!0);u(this,"__v_isShallow",!1);u(this,"_rawValue");u(this,"_value");u(this,"getSignal");u(this,"setSignal");this._rawValue=n;const[e,o]=G(n);this.getSignal=e,this.setSignal=o,this._value=e()}get value(){return this.getSignal()}set value(n){this.setSignal(n),this._rawValue=n}}ft=J;function Q(t){return new Y(t)}function v(t,n){return Object.assign({},t,n)}function X(t){return["string","number"].includes(typeof t)&&t!==""}function Z(t){return!/^on/.test(t)}function N(t){return typeof t=="function"&&!$(t)}function h(t,n,...e){const o={tag:t,attrs:n||{},children:e};return N(o.tag)&&(o.tag.prototype._id=K(),o.children.length===0&&o.attrs.children&&(o.children=o.attrs.children)),o}const E=Symbol("Fragment");function $(t){return typeof t=="function"&&t.prototype[E]===E}function _(t,n={},e=[""]){if($(t)){const i=v(n,{children:e}),c=t(i);return d(c)}if(N(t)){const i=v(n,{children:e}),c=t(i);return _(c.tag,c.attrs,c.children)}let o="";for(const i in n){if(i.startsWith("on")||i==="ref")continue;let c=typeof n[i]=="function"&&Z(i)?n[i]():n[i];if(i==="className"){c&&(o+=` class="${c}"`);continue}if(i==="style"&&F(c)){for(const s in c)typeof c[s]=="function"&&(c[s]=c[s]());c='"'+JSON.stringify(c).slice(1,-1).replaceAll('"',"").replaceAll(",",";")+'"'}o+=` ${i}="${c}"`}const r=d(e);return`<${t}${o}>${r}</${t}>`}function d(t){let n="";return t.forEach(e=>{if(X(e)){n+=e.toString();return}if(z(e)){n+=d(e);return}if(typeof e=="function"){const o=e();n+=d([o]);return}if(F(e)){n+=_(e.tag,e.attrs,e.children);return}}),n}function k({tag:t,attrs:n,children:e}){return _(t,n,e)}function tt(t){const n=new URL("http://0.0.0.0"+t),e=n.pathname,o=b.routes.find(r=>e.startsWith(r.path+"/")&&r.exact===!1);return{monitor:o?o.path:e,fullPath:n.href.replace(n.origin,""),path:e,query:nt(n.search),hash:n.hash}}function nt(t){const n={};return t.replace("?","").split("&").forEach(o=>{const[r,i]=o.split("=");r&&i&&(n[r]=i)}),n}function et(t){const{routes:n}=b,e=n.find(r=>r.path===t);if(e)return e;const o=n[n.length-1];if(o&&o.path===void 0&&o.component)return o}const b={base:"",mode:"history",ssrDataKey:"g_initialProps",routes:[]};let l="",T;async function ot(t){const n=tt(t),e=et(n.monitor);if(!e)return;const{getInitialProps:o}=e.component.prototype;if(typeof o=="function")return T=await o(n),T}async function rt(t,n,e){l=e;const o=await ot(n),r=k(h(t,null)),i=l.search("</body>"),c=o===void 0?"":`<script>window.${b.ssrDataKey}=${JSON.stringify(o)}<\/script>`;return l=l.slice(0,i)+c+l.slice(i,l.length),l.replace("<!--ssr-outlet-->",r)}function it(){const t=Q(0);return h("div",null,h("h1",null,()=>t.value),h("button",{onclick:()=>t.value++},"click"))}const w={"text/html":[".html"],"text/css":[".css"],"application/javascript;":[".js"],"application/json":[".json"],"image/vnd.microsoft.icon":[".ico"],"image/jpeg":[".jpg",".jpeg"],"image/png":[".png"],"image/gif":[".gif"],"application/pdf":[".pdf"],"font/woff2":[".worf2"],"font/woff":[".worf"],"font/ttf":[".ttf"],"application/octet-stream":[".mp4",".avi"]};function ct(){const t=Object.values(w).flat();return[".gz"].concat(t)}function st(t){t=t.toLowerCase();let n=null;for(const e in w)if(w[e].includes(t)){n=e;break}return n}const ut="production",I=Object.freeze({BASE_URL:"",NODE_ENV:ut,BASE_API:"http://hicky.hpyyb.cn/api",GITHUB_URL:"https://github.com/yubo9807/"}),lt=M.readFileSync(g.resolve(__dirname,"index.html"),"utf-8"),at=W.createServer(async(t,n)=>{const e=t.url.replace(I.BASE_URL,""),o=g.extname(e);if(ct().includes(o)){const r=g.resolve(__dirname,e.slice(1));M.readFile(r,(i,c)=>{if(i)n.writeHead(404,{"Content-Type":"text/plain"}),n.end("Not Found");else{const s=st(o);s&&n.setHeader("Content-Type",s),n.write(c),n.end()}})}else{const r=await rt(it,e,lt);n.write(r),n.end()}}),x=3e3;at.listen(x,()=>{console.log(`http://localhost:${x}${I.BASE_URL}`)});
