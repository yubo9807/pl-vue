"use strict";var ht=Object.defineProperty;var mt=(t,e,n)=>e in t?ht(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var l=(t,e,n)=>(mt(t,typeof e!="symbol"?e+"":e,n),n);const yt=require("http"),Q=require("fs"),T=require("path"),gt=require("axios-minified");function bt(){return Number(Math.random().toString().slice(2)).toString(32)}function H(t){return Object.prototype.toString.call(t).slice(8,-1).toLowerCase()}function b(t){return["object","array"].includes(H(t))}function wt(t,e){return Object.prototype.hasOwnProperty.call(t,e)}function X(t,e){if(b(t)&&b(e)){const n=Object.keys(t),o=Object.keys(e);if(n.length!==o.length)return!1;for(const r of n)if(!o.includes(r)||!X(t[r],e[r]))return!1;return!0}else return t===e}function Z(){return typeof window=="object"}function tt(t){return H(t)==="object"}function et(t){return Array.isArray(t)}function nt(t){return typeof t=="string"}function vt(t){return["string","number"].includes(typeof t)&&t!==""}function Rt(t){return!/^on/.test(t)}function ot(t){return typeof t=="function"&&!rt(t)}function c(t,e,...n){const o={tag:t,attrs:e||{},children:n};return ot(o.tag)&&(o.tag.prototype._id=bt(),o.children.length===0&&o.attrs.children&&(o.children=o.attrs.children)),o}function $({children:t}){return t}const P=Symbol("Fragment");$.prototype[P]=P;function rt(t){return typeof t=="function"&&t.prototype[P]===P}function K(t){Promise.resolve().then(t)}let _=null;const O=new WeakMap;function St(t){_=t,t(),_=null}function _t(t){const e=O.get(t)||[],n=e.some(o=>_===o);_&&!n&&(e.push(_),O.set(t,e))}function G(t){const e=O.get(t);e&&e.forEach((n,o)=>{n()===!0&&(e.splice(o,1),O.set(t,e))})}const jt=new WeakMap,I=new WeakMap,U={RAW:Symbol("__v_raw"),IS_READONLY:Symbol("__v_isReadonly")};function B(t){if(!b(t)||Object.isFrozen(t)||jt.get(t))return t;let e=null;return new Proxy(t,{get(n,o,r){if(o===U.RAW)return n;if(b(n[o]))return B(n[o]);const s=Reflect.get(n,o,r);return _t(n),s},set(n,o,r,s){if(n[U.IS_READONLY])return!0;if(b(n[o])){const y=n[o],W=new Set;for(const v in r)W.add(v),this.set(y,v,r[v],s[o]);for(const v in y)W.has(v)||this.deleteProperty(y,v);return!0}if(Reflect.get(n,o,s)===r)return!0;const a=Reflect.set(n,o,r,s),w=I.get(n)||new Set;w.add(o);const p=w.size;return I.set(n,w),K(()=>{const y=Reflect.get(n,o,s);a&&y===r&&p===1&&G(n),I.delete(n)}),a},deleteProperty(n,o){const r=Reflect.get(n,o);if(b(r)){for(const a in r)this.deleteProperty(r,a);return!0}const s=wt(n,o),i=Reflect.deleteProperty(n,o);return e=o,K(()=>{s&&i&&r!==void 0&&o===e&&(G(n),e=null)}),i}})}function Nt(t){return!!t[U.RAW]}function st(t){return Nt(t)?t[U.RAW]:t}function At(t){const e=B({value:t});function n(){return e.value}function o(r){e.value=r}return[n,o]}const ct="__v_isRef";var ke;class Pt{constructor(e){l(this,ke,!0);l(this,"__v_isShallow",!1);l(this,"_rawValue");l(this,"_value");l(this,"getSignal");l(this,"setSignal");this._rawValue=e;const[n,o]=At(e);this.getSignal=n,this.setSignal=o,this._value=n()}get value(){return this.getSignal()}set value(e){this.setSignal(e),this._rawValue=e}}ke=ct;function R(t){return new Pt(t)}const j=function(){const t=new WeakMap,e=["null","weakset","weakmap"],n={set(o){const r=new Set;for(const s of o)r.add(j(s));return r},map(o){const r=new Map;for(const[s,i]of o.entries())r.set(s,j(i));return r}};return function(o){const r=H(o);if(typeof o!="object"||e.includes(r))return o;if(t.has(o))return t.get(o);if(n[r])return n[r](o);const s=et(o)?[]:{};Object.setPrototypeOf(s,Object.getPrototypeOf(o)),t.set(o,s);for(const i in o)s[i]=j(o[i]);return s}}();function M(t,e){return Object.assign({},t,e)}function Ot(t,e,n={}){let o=!1;if(o)return;const r=t();n.immediate&&e(r,void 0);let s=j(r),i=!0;return St(()=>{if(o)return!0;const a=t();if(b(a)){n.deep&&!X(a,s)&&(e(a,s),s=j(a));return}if(i){i=!1;return}a!==s&&(e(a,s),s=a)}),()=>{o=!0}}function k(t){const e=new URL("http://0.0.0.0"+t),n=e.pathname,o=u.routes.find(r=>n.startsWith(r.path+"/")&&r.exact===!1);return{monitor:o?o.path:n,fullPath:e.href.replace(e.origin,""),path:n,query:Ut(e.search),hash:e.hash}}function D(t){if(nt(t))return t;t=t;const e=t.path;let n="";for(const s in t.query)n+=`&${s}=${t.query[s]}`;n=n?"?"+n:"";const o=t.hash?"#"+t.hash:"";return e+n+o}function Ut(t){const e={};return t.replace("?","").split("&").forEach(o=>{const[r,s]=o.split("=");r&&s&&(e[r]=s)}),e}function it(){return u.mode==="history"?location.href.replace(location.origin+u.base,""):location.hash.slice(1)}function V(t){const{routes:e}=u,n=e.find(r=>r.path===t);if(n)return n;const o=e[e.length-1];if(o.path===void 0&&o.component)return o}function at(t){const e=D(t);u.mode==="history"?history.pushState({},"",u.base+e):location.hash=e,E(e)}function ut(t){const e=D(t);u.mode==="history"?history.replaceState({},"",u.base+e):location.hash=e,E(e)}function A(t){history.go(t)}function kt(){return{push:at,replace:ut,go:A}}const u={base:"",mode:"history",ssrDataKey:"g_initialProps",routes:[]};let h=null;function Lt(t={}){if(Object.assign(u,t),Z()){const e=k(it());h=B(e)}else h??(h=k("/"));return{back:()=>A(-1),forward:()=>A(1),go:A,push:at,replace:ut,options:u,currentRoute:st(h)}}function E(t){const e=k(t);for(const n in e)h[n]=e[n]}function $t(){return h}function x(t,e={},n=[""]){if(rt(t)){const s=M(e,{children:n}),i=t(s);return L(i)}if(ot(t)){const s=M(e,{children:n}),i=t(s);return x(i.tag,i.attrs,i.children)}let o="";for(const s in e){if(s.startsWith("on")||s==="ref")continue;let i=typeof e[s]=="function"&&Rt(s)?e[s]():e[s];if(s==="className"){i&&(o+=` class="${i}"`);continue}if(s==="style"&&tt(i)){for(const a in i)typeof i[a]=="function"&&(i[a]=i[a]());i='"'+JSON.stringify(i).slice(1,-1).replaceAll('"',"").replaceAll(",",";")+'"'}o+=` ${s}="${i}"`}const r=L(n);return`<${t}${o}>${r}</${t}>`}function L(t){let e="";return t.forEach(n=>{if(vt(n)){e+=n.toString();return}if(et(n)){e+=L(n);return}if(typeof n=="function"){const o=n();e+=L([o]);return}if(tt(n)){e+=x(n.tag,n.attrs,n.children);return}}),e}function Et({tag:t,attrs:e,children:n}){return x(t,e,n)}let f="";function xt(t){const e=[];if(t.children.forEach(n=>{n.tag==="title"?e.push(new RegExp("<title")):n.tag==="meta"&&n.attrs.name&&e.push(new RegExp(`<meta name=("|')?${n.attrs.name}`))}),f){const r=f.match(/\<head\>(.*)\<\/head>/s)[1].trim().split(`
`).filter(i=>i.includes("<"));for(let i=0;i<r.length;i++){r[i]=r[i].trim();for(let a=0;a<e.length;a++)e[a].test(r[i])&&(r[i]="")}t.children.forEach(i=>{const a=x(i.tag,i.attrs,i.children);r.push(a)});const s=r.filter(i=>i).join(`
`);f=f.replace(/\<head\>.*\<\/head>/s,`<head>
${s}
</head>`)}return c($,null)}let F,q="/";async function It(t){const e=k(t),n=V(e.monitor);if(!n)return;const{getInitialProps:o}=n.component.prototype;if(typeof o=="function")return F=await o(e),F}function Tt(){let t="";if(u.mode==="history")t=q.replace(u.base,"");else{const n=q.match(/#.*/);t=n?n[0]:""}E(t);const e=V(h.monitor);return c($,null,e&&c(e.component,{data:F}))}async function Mt(t,e,n){f=n,q=e;const o=await It(e),r=Et(c(t,null)),s=f.search("</body>"),i=o===void 0?"":`<script>window.${u.ssrDataKey}=${JSON.stringify(o)}<\/script>`;return f=f.slice(0,s)+i+f.slice(s,f.length),f.replace("<!--ssr-outlet-->",r)}function Ft(t){window.addEventListener("popstate",()=>{E(it())});const e=R(null);let n;return Ot(()=>h.monitor,async o=>{const r=V(o);if(!r)return;const{getInitialProps:s}=r.component.prototype;if(typeof s=="function")if(window[u.ssrDataKey])n=window[u.ssrDataKey],delete window[u.ssrDataKey];else{e.value=t.loading;const i=st(h);n=await s(i)}e.value=r.component},{immediate:!0}),c($,null,()=>e.value&&c(e.value,{data:n}))}function qt(t){return Z()?c(Ft,{...t}):c(Tt,null)}const Ct={to:"/",type:"push"};function N(t){t=M(Ct,t);const e=nt(t.to)?t.to:D(t.to),n=u.base+(u.mode==="hash"?"#"+e:e),o=kt();function r(s){s.preventDefault(),t.type==="push"?o.push(e):o.replace(e)}return c("a",{className:t.className,href:n,onclick:r},t.children)}class Ht{constructor(e){l(this,"fn");this.fn=e}}var Le;class z{constructor(e,n){l(this,"__v_isReadonly",!0);l(this,Le,!0);l(this,"_cacheable",!0);l(this,"_dirty",!0);l(this,"computed");l(this,"_setter");this.computed=new Ht(e),this._setter=n}get value(){return this.computed.fn()}set value(e){this._setter&&this._setter(e)}}Le=ct;function Bt(t){return typeof t=="function"?new z(t):new z(t.get,t.set)}const Dt="production",m=Object.freeze({BASE_URL:"",NODE_ENV:Dt,BASE_API:"http://hicky.hpyyb.cn/api",GITHUB_URL:"https://github.com/yubo9807/"}),Vt="banner-64e93c",Wt="box-e24f47",Kt="bg-a171c3",Gt="blend-4c743b",zt="btn-05bf70",Jt="enter-825ce4",Yt="article-e5ab12",Qt="paragraph-6f9bd7",Xt="mark-66b760",Zt="peculiarity-fd110f",d={banner:Vt,box:Wt,bg:Kt,blend:Gt,btn:zt,enter:Jt,article:Yt,paragraph:Qt,mark:Xt,peculiarity:Zt},te="main-67f0a8",ee={main:te},ne="header-ada874",oe="navigation-0bbde6",J={header:ne,navigation:oe};function re(){return c("header",{className:J.header},c("div",null,c(N,{to:"/"},c("h1",null,"Pl Vue"))),c("nav",{className:J.navigation},c(N,{to:"/docs"},"文档"),c("a",{href:m.GITHUB_URL+"mvvm_vue3",target:"_blank"},"GitHub")))}const se="footer-967a98",ce={footer:se};function ie(){return c("footer",{className:ce.footer},c("strong",null,"⚠️ 注意事项"),c("p",null,"本文文档仅供学习参考。并未发布正式版本，不提供任何商业用途。"))}function lt(t){return c("div",null,c(re,null),c("main",{className:ee.main},t.children),c(ie,null))}function S(...t){return t.join(" ").trim().replace(/\s+/," ")}const C={"text/html":[".html"],"text/css":[".css"],"application/javascript;":[".js"],"application/json":[".json"],"image/vnd.microsoft.icon":[".ico"],"image/jpeg":[".jpg",".jpeg"],"image/png":[".png"],"image/gif":[".gif"],"application/pdf":[".pdf"],"font/woff2":[".worf2"],"font/woff":[".worf"],"font/ttf":[".ttf"],"application/octet-stream":[".mp4",".avi"]};function ae(){const t=Object.values(C).flat();return[".gz"].concat(t)}function ue(t){t=t.toLowerCase();let e=null;for(const n in C)if(C[n].includes(t)){e=n;break}return e}function le(){return c(lt,null,c("div",{className:d.banner},c("div",{className:d.box},c("div",{className:d.bg},c("strong",null,"Pl Vue"),c("p",null,"一个 JS 库，只关心数据与函数之间的联动")),c(N,{className:d.btn,to:"/docs/reactivity"},"API 参考"))),c("article",{className:S("leayer","module-gap",d.article)},c("p",{className:d.paragraph},"Pl Vue 是一个将响应式数据的使用高度交予开发者决定的一个库，它不依赖于任何第三方库。该库提供了组件化、挂载钩子、Router、Store 以及服务端渲染相关 API。项目搭建可参考  ",c("a",{href:m.GITHUB_URL+"mvvm_vue3"},"GitHub"),"。"),c("p",{className:d.mark},"该库本身与 Vue 框架无任何关系，只是多数 API 在命名上相同而已。")),c("ul",{className:S("leayer","module-gap",d.peculiarity)},c("li",null,c("h2",null,"响不响应式的，高度交予开发者决定"),c("p",null,"JSX 编程方式，响应式数据统一使用函数的方式包裹。",c(N,{to:"/docs/property"},"了解更多"))),c("li",null,c("h2",null,"无虚拟 DOM 参与"),c("p",null,"将用到响应式数据的函数进行收集，在数据更新后执行相应的函数。因此直接省去了虚拟 DOM 的比较。")),c("li",null,c("h2",null,"拿来就用，灵活多变"),c("p",null,"无需脚手架，原生应用亦可构建。",c("a",{href:m.GITHUB_URL+"single-page",target:"_blank"},"代码示例"))),c("li",null,c("h2",null,"代码精简，minify < 12k"),c("p",null,"手写 h 与 Fragment，将代码体积精简到极致。"))))}const fe="container-4ac8c9",pe="side-f9a8bf",de="active-889810",he="content-a47edb",me="show-side-a60745",g={container:fe,side:pe,active:de,content:he,"show-side":"show-side-a60745",showSide:me};class ye{constructor(e){l(this,"config");l(this,"instance");this.config=e,this.instance=gt.create(e),this.instance.interceptors.request.use(n=>this.requestUse(n)),this.instance.interceptors.response.use(n=>this.responseUse(n),n=>{const{response:o,config:r,message:s}=n;if(o&&o.data)return this.responseUse(o);const{url:i}=n.config;return Promise.reject({code:500,msg:s||"network error: "+i})})}requestUse(e){return e}responseUse(e){const n=e.data;return(this[n.code]||this.error)(e)}200(e){return Promise.resolve(e.data)}error(e){const{data:n,config:o}=e;return Promise.reject(n)}}function ge(t){return t.then(e=>[null,e]).catch(e=>[e,null])}class be extends ye{constructor(){super({baseURL:m.BASE_API,timeout:5e3})}}const we=new be;function ft(t){return ge(we.instance(t))}function ve(){return ft({url:"/file/read",params:{path:"/plvue/config.json"}})}function Re(t){return ft({url:"/file/read",params:{path:t}})}function pt({data:t}){const e=R(t.list),n=R(t.content),o=$t(),r=R(!1),s=R(i());function i(){return o.path.replace(o.monitor,"").slice(1)||e.value[0]&&e.value[0].value}const a=R(null),w=Bt(()=>{var p;return(p=e.value.find(y=>y.value===s.value))==null?void 0:p.label});return c(lt,null,c(xt,null,c("title",null,()=>w.value+" | Pl Vue"),c("meta",{name:"description",content:()=>`${w.value}`})),c("div",{className:S("leayer",g.container)},c("ul",{className:()=>S(g.side,r.value?g.active:"")},e.value.map(p=>c("li",{className:()=>s.value===p.value?g.active:""},c(N,{to:`/docs/${p.value}`},p.label)))),c("div",{ref:a,className:S(g.content,"markdown")},c("div",{innerHTML:()=>n.value}))),c("div",{className:()=>S(g.showSide,r.value?g.active:""),onclick:()=>r.value=!r.value}))}pt.prototype.getInitialProps=async t=>{const e=await Se(),n=await _e(t.path.replace(t.monitor,"")||e[0]&&e[0].value);return{list:e,content:n}};async function Se(){const[t,e]=await ve(),n=[];if(t)return n;const o=JSON.parse(e.data.content);for(const r in o)n.push({label:o[r],value:r});return n}async function _e(t){const[e,n]=await Re(`/plvue/${t}.md`);return e?"":n.data.content}const je="not-found-710606",Ne={"not-found":"not-found-710606",notFound:je};function Ae(){return c("div",{className:Ne["not-found"]},"404")}Lt({base:m.BASE_URL,mode:"history",routes:[{path:"/",component:le},{path:"/docs",component:pt,exact:!1},{component:Ae}]});function Pe(){return c(qt,null)}const dt=m.BASE_URL.slice(1),Oe=Q.readFileSync(T.resolve(__dirname,dt,"index.html"),"utf-8"),Ue=yt.createServer(async(t,e)=>{const n=t.url.replace(m.BASE_URL||"/","/"),o=T.extname(n);if(ae().includes(o)){const r=T.resolve(__dirname,dt,n.slice(1));Q.readFile(r,(s,i)=>{if(s)e.writeHead(404,{"Content-Type":"text/plain"}),e.end("Not Found");else{const a=ue(o);a&&e.setHeader("Content-Type",a),e.write(i),e.end()}})}else{const r=await Mt(Pe,n,Oe);e.write(r),e.end()}}),Y=3e3;Ue.listen(Y,()=>{console.log(`http://localhost:${Y}${m.BASE_URL}`)});
