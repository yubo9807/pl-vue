(()=>{"use strict";var e,t={210:(e,t,n)=>{var o=n(394),r=n(369);var u=n(118);const a={count:0},l={setCount(e){a.count=e}},i=(0,u.M)(a,l);function c(e){const t=i(),n=(0,o.ref)(0),r=(0,o.ref)(null);return(0,o.onUnmounted)(c,(()=>{console.log(c.name,"组件被卸载")})),(0,o.h)("div",{className:"page-home__c4978"},(0,o.h)("h1",null,"Store: ",(()=>t.count)),(0,o.h)("button",{onclick:()=>t.setCount(++t.count)},"Store change"),(0,o.h)("h1",{ref:r},"Ref: count ",(0,o.h)("span",{className:"red-font__e0f12"},(()=>n.value))),(0,o.h)("button",{onclick:()=>n.value++},"count++"),(0,o.h)(s,{count:()=>n.value}),(0,o.h)("h1",null,"Page.getInitialProps: ",e.data))}function s(e){const t=(0,o.computed)((()=>function(e="000000",t="ffffff"){const n=parseInt(e,16);return"#"+function(e,t=0){return Math.floor(Math.random()*(e-t)+t)}(parseInt(t,16),n).toString(16)}().slice(0,-1)+e.count().toString().slice(0,1)));return(0,o.h)("h1",{style:{color:()=>t.value}},"子组件 ",e.count)}c.prototype.getInitialProps=async()=>new Promise((e=>{setTimeout((()=>{e(123)}),300)}));const h=[{path:"/",component:c,exact:!0},{path:"/about",component:function(){return(0,o.h)("div",{className:"page-about__bf47c"},(0,o.h)("p",null,"自个儿手写的 Vue 响应式源码，实现个大概！"),(0,o.h)("strong",null,"Vue API"),(0,o.h)("p",null,Object.keys(o).join("、")),(0,o.h)("strong",null,"Router API"),(0,o.h)("p",null,Object.keys(r).join("、")))}},{component:function(){return(0,o.h)("div",{className:"not-found__b4c00"},"404")}}];function f(){return(0,o.h)("div",null,"loading...")}const p=document.getElementById("root");p.innerHTML="",p.appendChild((0,o.render)((0,o.h)((function(e){return(0,r.initRouter)({base:"/dist",mode:"hash",isBrowser:e.isBrowser}),(0,o.h)(o.Fragment,null,(0,o.h)("nav",{className:"header__b194a"},(0,o.h)(r.Link,{to:"/"},"首页"),(0,o.h)(r.Link,{to:"/about"},"关于"),(0,o.h)(r.Link,{to:"/404"},"notFound"),(0,o.h)("a",{className:"github__af57b",href:"https://github.com/yubo9807/mvvm_vue3",target:"_blank"},"GitHub")),(0,o.h)(r.Router,{url:e.url,data:e.data,Loading:f},...h.map((e=>(0,o.h)(r.Route,{...e})))))}),{isBrowser:!0})))}},n={};function o(e){var r=n[e];if(void 0!==r)return r.exports;var u=n[e]={exports:{}};return t[e](u,u.exports,o),u.exports}o.m=t,e=[],o.O=(t,n,r,u)=>{if(!n){var a=1/0;for(s=0;s<e.length;s++){for(var[n,r,u]=e[s],l=!0,i=0;i<n.length;i++)(!1&u||a>=u)&&Object.keys(o.O).every((e=>o.O[e](n[i])))?n.splice(i--,1):(l=!1,u<a&&(a=u));if(l){e.splice(s--,1);var c=r();void 0!==c&&(t=c)}}return t}u=u||0;for(var s=e.length;s>0&&e[s-1][2]>u;s--)e[s]=e[s-1];e[s]=[n,r,u]},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e={179:0};o.O.j=t=>0===e[t];var t=(t,n)=>{var r,u,[a,l,i]=n,c=0;if(a.some((t=>0!==e[t]))){for(r in l)o.o(l,r)&&(o.m[r]=l[r]);if(i)var s=i(o)}for(t&&t(n);c<a.length;c++)u=a[c],o.o(e,u)&&e[u]&&e[u][0](),e[u]=0;return o.O(s)},n=self.webpackChunkvue=self.webpackChunkvue||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var r=o.O(void 0,[485],(()=>o(210)));r=o.O(r)})();