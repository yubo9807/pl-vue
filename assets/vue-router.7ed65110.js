"use strict";(self.webpackChunkvue=self.webpackChunkvue||[]).push([[517],[(t,n,e)=>{e.r(n),e.d(n,{BrowserRouter:()=>H,HashRouter:()=>E,Link:()=>S,Redirect:()=>b,Route:()=>R,useHistory:()=>C});var o=e(218),r=e(649),u=e(427),s=e(339),a=e(258),c=e(83),h=e(433);function i(t){const n=t.path;let e="";for(const n in t.query)e+=`&${n}=${t.query[n]}`;return e=e?"?"+e:"",n+e+(t.hash?"#"+t.hash:"")}function l(t){return t.replace(/\/+/g,"/")}const p="/dist";let f="history";function y(t){f=t}const v=(0,h.qj)({path:"",query:{},hash:"",meta:{}});function d(t){const n=new URL(t);v.path=n.pathname,v.query=function(t){const n={};return t.replace("?","").split("&").forEach((t=>{const[e,o]=t.split("=");e&&o&&(n[e]=o)})),n}(n.search),v.hash=n.hash}function m(t){let n="";n="string"==typeof t?"history"===f?l(p+t):t:i(t),"history"===f?history.pushState({},null,n):location.hash=n,d(location.href)}function g(t){let n="";n="string"==typeof t?"history"===f?l(p+t):t:i(t),"history"===f?history.pushState({},null,n):location.hash=n,d(location.href)}function w(t){history.go(t),d(location.href)}function C(){return{mode:f,currentRoute:v,push:m,replace:g,go:w}}function R(t){const n=t.component;return(0,s.h)(n,null)}const k=Symbol("Route");function b(t){const n=C();return(0,c.bv)((()=>{n.replace(t.to)})),(0,s.h)("div",null)}function q(t){const n=(0,o.iH)(null);return(0,r.Y)((()=>v.path),(e=>{const o=t.children.filter((t=>"object"==typeof t&&t.tag.prototype[k]===k)),r=o.find((t=>t.attrs.exact?e===t.attrs.path:(e+"/").startsWith(t.attrs.path+"/")));if(r)(0,u.Y)((()=>{n.value=r.attrs.component}));else{const t=o[o.length-1];(0,a.pE)(t.tag)&&!t.attrs.path?n.value=t.attrs.component:n.value=null}}),{immediate:!0}),{CurrentComp:n}}function H(t){function n(){return location.href.replace(p,"")}y("history"),d(n()),window.addEventListener("popstate",(()=>{d(n())}));const{CurrentComp:e}=q(t);return(0,s.h)(s.H,null,(()=>(0,s.h)(e.value,null)))}function E(t){function n(){return location.origin+location.hash.slice(1)}y("hash"),d(n()),window.addEventListener("hashchange",(()=>{d(n())}));const{CurrentComp:e}=q(t);return(0,s.h)(s.H,null,(()=>e.value?(0,s.h)(e.value,null):null))}R.prototype[k]=k;var L=e(679);function S(t={to:"/",type:"push"}){const n=(0,L.computed)((()=>{const n=t.to;return"string"==typeof n?n:i(n)}));return(0,L.h)("a",{href:n.value,onclick:function(t){t.preventDefault();const e=C();"history"===e.mode?e.push(n.value):location.hash=n.value}},t.children)}}]]);