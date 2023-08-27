var k=Object.defineProperty;var I=(n,t,r)=>t in n?k(n,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):n[t]=r;var y=(n,t,r)=>(I(n,typeof t!="symbol"?t+"":t,r),r);import{h as e,L as b,r as v,u as A,o as B,w as O,n as H,c as T,R as $,a as q}from"./plvue-34c666e7.js";import{a as x}from"./axios-minified-06d31459.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))c(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&c(s)}).observe(document,{childList:!0,subtree:!0});function r(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function c(a){if(a.ep)return;a.ep=!0;const o=r(a);fetch(a.href,o)}})();const C="production",p=Object.freeze({BASE_URL:"",NODE_ENV:C,BASE_API:"http://hicky.hpyyb.cn/api",GITHUB_URL:"https://github.com/yubo9807/"}),j="banner-64e93c",D="box-e24f47",F="article-e5ab12",G="paragraph-6f9bd7",V="mark-66b760",M="peculiarity-fd110f",m={banner:j,box:D,article:F,paragraph:G,mark:V,peculiarity:M},J="main-67f0a8",z={main:J},K="header-ada874",W="navigation-0bbde6",_={header:K,navigation:W};function X(){return e("header",{className:_.header},e("div",null,e(b,{to:"/"},e("h1",null,"Pl Vue"))),e("nav",{className:_.navigation},e(b,{to:"/docs"},"文档"),e("a",{href:p.GITHUB_URL+"mvvm_vue3",target:"_blank"},"GitHub")))}const Q="footer-967a98",Y={footer:Q};function Z(){return e("footer",{className:Y.footer},e("strong",null,"⚠️ 注意事项"),e("p",null,"本文文档仅供学习参考。并未发布正式版本，不提供任何商业用途。"))}function N(n){return e("div",null,e(X,null),e("main",{className:z.main},n.children),e(Z,null))}function h(...n){return n.join(" ").trim().replace(/\s+/," ")}function P(){return e(N,null,e("div",{className:m.banner},e("div",{className:m.box},e("strong",null,"Pl Vue"),e("p",null,"一个 JS 库，只关心数据与函数之间的联动"))),e("article",{className:h("leayer","module-gap",m.article)},e("p",{className:m.paragraph},"Plagiarize Vue 是一个轻量级、不依赖任何第三方库的 JS 数据响应式库，除响应式 API 外，该库还提供了组件化、挂载钩子、Router、Store 以及服务端渲染相关 API，项目搭建可参考  ",e("a",{href:p.GITHUB_URL+"mvvm_vue3"},"GitHub"),"。"),e("p",{className:m.mark},"该库本身与 Vue 框架无任何关系，只是多数 API 在命名上相同而已。")),e("ul",{className:h("leayer","module-gap",m.peculiarity)},e("li",null,e("h2",null,"响不响应式的，高度交予开发者决定"),e("p",null,"JSX 编程方式，响应式数据统一使用函数的方式包裹。",e("a",{href:p.GITHUB_URL+"mvvm_vue3",target:"_blank"},"了解更多"))),e("li",null,e("h2",null,"无虚拟 DOM 参与"),e("p",null,"将用到响应式数据的函数进行收集，在数据更新后执行相应的函数。因此直接省去了虚拟 DOM 的比较。")),e("li",null,e("h2",null,"拿来就用，灵活多变"),e("p",null,"无需脚手架，原生应用亦可构建。",e("a",{href:p.GITHUB_URL+"single-page",target:"_blank"},"代码示例"))),e("li",null,e("h2",null,"代码精简，打包代码仅有 10k"),e("p",null,"手写 h 与 Fragment，将代码体积精简到极致。"))))}P.prototype.getInitialProps=async()=>"home";const ee="modulepreload",te=function(n){return"/"+n},w={},L=function(t,r,c){if(!r||r.length===0)return t();const a=document.getElementsByTagName("link");return Promise.all(r.map(o=>{if(o=te(o),o in w)return;w[o]=!0;const s=o.endsWith(".css"),g=s?'[rel="stylesheet"]':"";if(!!c)for(let i=a.length-1;i>=0;i--){const f=a[i];if(f.href===o&&(!s||f.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${o}"]${g}`))return;const l=document.createElement("link");if(l.rel=s?"stylesheet":ee,s||(l.as="script",l.crossOrigin=""),l.href=o,document.head.appendChild(l),s)return new Promise((i,f)=>{l.addEventListener("load",i),l.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${o}`)))})})).then(()=>t()).catch(o=>{const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=o,window.dispatchEvent(s),!s.defaultPrevented)throw o})},ne="container-4ac8c9",re="side-f9a8bf",oe="active-889810",ae="content-a47edb",se="show-side-a60745",u={container:ne,side:re,active:oe,content:ae,"show-side":"show-side-a60745",showSide:se};class ce{constructor(t){y(this,"config");y(this,"instance");this.config=t,this.instance=x.create(t),this.instance.interceptors.request.use(r=>this.requestUse(r)),this.instance.interceptors.response.use(r=>this.responseUse(r),r=>{const{response:c,config:a,message:o}=r;if(c&&c.data)return this.responseUse(c);const{url:s}=r.config;return Promise.reject({code:500,msg:o||"network error: "+s})})}requestUse(t){return t}responseUse(t){const r=t.data;return(this[r.code]||this.error)(t)}200(t){return Promise.resolve(t.data)}error(t){const{data:r,config:c}=t;return Promise.reject(r)}}function ie(n){return n.then(t=>[null,t]).catch(t=>[t,null])}class le extends ce{constructor(){super({baseURL:p.BASE_API,timeout:5e3})}}const ue=new le;function E(n){return ie(ue.instance(n))}function de(){return E({url:"/file/read",params:{path:"/plvue/config.json"}})}function fe(n){return E({url:"/file/read",params:{path:n}})}function R(n){const t=v(n.data.list),r=v(n.data.content),c=A(),a=v(!1),o=v(s()||t.value[0]&&t.value[0].value);function s(){return c.path.replace(c.monitor,"").slice(1)}const g=v(null);return B(async()=>{O(()=>c.path,async i=>{o.value=s(),r.value=await U(o.value),a.value=!1,H(l)}),L(()=>import("./highlight.js-bbd7096d.js").then(i=>i.d),["assets/highlight.js-bbd7096d.js","assets/axios-minified-06d31459.js","assets/highlight-54439809.css"]);const d=(await L(()=>import("./highlight.js-bbd7096d.js").then(i=>i.c),["assets/highlight.js-bbd7096d.js","assets/axios-minified-06d31459.js","assets/highlight-54439809.css"])).default;l();function l(){g.value.querySelectorAll("pre code").forEach(f=>{d.highlightElement(f)})}}),e(N,null,e("div",{className:h("leayer",u.container)},e("ul",{className:()=>h(u.side,a.value?u.active:"")},t.value.map(d=>e("li",{className:()=>o.value===d.value?u.active:""},e(b,{to:`/docs/${d.value}`},d.label)))),e("div",{ref:g,className:h(u.content,"markdown")},e("div",{innerHTML:()=>r.value}))),e("div",{className:()=>h(u.showSide,a.value?u.active:""),onclick:()=>a.value=!a.value}))}R.prototype.getInitialProps=async n=>{const t=await me(),r=await U(n.path.replace(n.monitor,"")||t[0]&&t[0].value);return{list:t,content:r}};async function me(){const[n,t]=await de(),r=[];if(n)return r;const c=JSON.parse(t.data.content);for(const a in c)r.push({label:c[a],value:a});return r}async function U(n){const[t,r]=await fe(`/plvue/${n}.md`);return t?"":r.data.content}const he="not-found-710606",pe={"not-found":"not-found-710606",notFound:he};function ve(){return e("div",{className:pe["not-found"]},"404")}T({base:p.BASE_URL,mode:"history",routes:[{path:"/",component:P},{path:"/docs",component:R,exact:!1},{component:ve}]});function ge(n){return e($,{url:n.url,data:n.data})}const S=document.getElementById("root");S.innerHTML="";S.appendChild(q(e(ge,{isBrowser:!0})));
