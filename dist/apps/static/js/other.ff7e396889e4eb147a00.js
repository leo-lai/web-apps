webpackJsonp([1],{122:function(t,e){},127:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("div",{staticClass:"l-app"},[t._v("\n  other page\n")])},staticRenderFns:[]}},56:function(t,e,n){"use strict";var r=[];e.a=r},63:function(t,e,n){n(122);var r=n(17)(n(69),n(127),null,null);t.exports=r.exports},64:function(t,e,n){"use strict";function r(t,e){}function o(t){return Object.prototype.toString.call(t).indexOf("Error")>-1}function i(t,e){switch(typeof e){case"undefined":return;case"object":return e;case"function":return e(t);case"boolean":return e?t.params:void 0}}function a(t,e,n){void 0===e&&(e={});var r,o=n||u;try{r=o(t||"")}catch(t){r={}}for(var i in e){var a=e[i];r[i]=Array.isArray(a)?a.slice():a}return r}function u(t){var e={};return(t=t.trim().replace(/^(\?|#|&)/,""))?(t.split("&").forEach(function(t){var n=t.replace(/\+/g," ").split("="),r=Pt(n.shift()),o=n.length>0?Pt(n.join("=")):null;void 0===e[r]?e[r]=o:Array.isArray(e[r])?e[r].push(o):e[r]=[e[r],o]}),e):e}function c(t){var e=t?Object.keys(t).map(function(e){var n=t[e];if(void 0===n)return"";if(null===n)return qt(e);if(Array.isArray(n)){var r=[];return n.forEach(function(t){void 0!==t&&(null===t?r.push(qt(e)):r.push(qt(e)+"="+qt(t)))}),r.join("&")}return qt(e)+"="+qt(n)}).filter(function(t){return t.length>0}).join("&"):null;return e?"?"+e:""}function s(t,e,n,r){var o=r&&r.options.stringifyQuery,i={name:e.name||t&&t.name,meta:t&&t.meta||{},path:e.path||"/",hash:e.hash||"",query:e.query||{},params:e.params||{},fullPath:f(e,o),matched:t?p(t):[]};return n&&(i.redirectedFrom=f(n,o)),Object.freeze(i)}function p(t){for(var e=[];t;)e.unshift(t),t=t.parent;return e}function f(t,e){var n=t.path,r=t.query;void 0===r&&(r={});var o=t.hash;void 0===o&&(o="");var i=e||c;return(n||"/")+i(r)+o}function h(t,e){return e===Ht?t===e:!!e&&(t.path&&e.path?t.path.replace(Ut,"")===e.path.replace(Ut,"")&&t.hash===e.hash&&l(t.query,e.query):!(!t.name||!e.name)&&(t.name===e.name&&t.hash===e.hash&&l(t.query,e.query)&&l(t.params,e.params)))}function l(t,e){void 0===t&&(t={}),void 0===e&&(e={});var n=Object.keys(t),r=Object.keys(e);return n.length===r.length&&n.every(function(n){var r=t[n],o=e[n];return"object"==typeof r&&"object"==typeof o?l(r,o):String(r)===String(o)})}function d(t,e){return 0===t.path.replace(Ut,"/").indexOf(e.path.replace(Ut,"/"))&&(!e.hash||t.hash===e.hash)&&v(t.query,e.query)}function v(t,e){for(var n in e)if(!(n in t))return!1;return!0}function y(t){if(!(t.metaKey||t.altKey||t.ctrlKey||t.shiftKey||t.defaultPrevented||void 0!==t.button&&0!==t.button)){if(t.currentTarget&&t.currentTarget.getAttribute){if(/\b_blank\b/i.test(t.currentTarget.getAttribute("target")))return}return t.preventDefault&&t.preventDefault(),!0}}function m(t){if(t)for(var e,n=0;n<t.length;n++){if(e=t[n],"a"===e.tag)return e;if(e.children&&(e=m(e.children)))return e}}function g(t){if(!g.installed){g.installed=!0,jt=t;var e=function(t){return void 0!==t},n=function(t,n){var r=t.$options._parentVnode;e(r)&&e(r=r.data)&&e(r=r.registerRouteInstance)&&r(t,n)};t.mixin({beforeCreate:function(){e(this.$options.router)?(this._routerRoot=this,this._router=this.$options.router,this._router.init(this),t.util.defineReactive(this,"_route",this._router.history.current)):this._routerRoot=this.$parent&&this.$parent._routerRoot||this,n(this,this)},destroyed:function(){n(this)}}),Object.defineProperty(t.prototype,"$router",{get:function(){return this._routerRoot._router}}),Object.defineProperty(t.prototype,"$route",{get:function(){return this._routerRoot._route}}),t.component("router-view",Tt),t.component("router-link",zt);var r=t.config.optionMergeStrategies;r.beforeRouteEnter=r.beforeRouteLeave=r.beforeRouteUpdate=r.created}}function b(t,e,n){var r=t.charAt(0);if("/"===r)return t;if("?"===r||"#"===r)return e+t;var o=e.split("/");n&&o[o.length-1]||o.pop();for(var i=t.replace(/^\//,"").split("/"),a=0;a<i.length;a++){var u=i[a];".."===u?o.pop():"."!==u&&o.push(u)}return""!==o[0]&&o.unshift(""),o.join("/")}function w(t){var e="",n="",r=t.indexOf("#");r>=0&&(e=t.slice(r),t=t.slice(0,r));var o=t.indexOf("?");return o>=0&&(n=t.slice(o+1),t=t.slice(0,o)),{path:t,query:n,hash:e}}function x(t){return t.replace(/\/\//g,"/")}function k(t,e){for(var n,r=[],o=0,i=0,a="",u=e&&e.delimiter||"/";null!=(n=Nt.exec(t));){var c=n[0],s=n[1],p=n.index;if(a+=t.slice(i,p),i=p+c.length,s)a+=s[1];else{var f=t[i],h=n[2],l=n[3],d=n[4],v=n[5],y=n[6],m=n[7];a&&(r.push(a),a="");var g=null!=h&&null!=f&&f!==h,b="+"===y||"*"===y,w="?"===y||"*"===y,x=n[2]||u,k=d||v;r.push({name:l||o++,prefix:h||"",delimiter:x,optional:w,repeat:b,partial:g,asterisk:!!m,pattern:k?A(k):m?".*":"[^"+C(x)+"]+?"})}}return i<t.length&&(a+=t.substr(i)),a&&r.push(a),r}function E(t,e){return _(k(t,e))}function R(t){return encodeURI(t).replace(/[\/?#]/g,function(t){return"%"+t.charCodeAt(0).toString(16).toUpperCase()})}function O(t){return encodeURI(t).replace(/[?#]/g,function(t){return"%"+t.charCodeAt(0).toString(16).toUpperCase()})}function _(t){for(var e=new Array(t.length),n=0;n<t.length;n++)"object"==typeof t[n]&&(e[n]=new RegExp("^(?:"+t[n].pattern+")$"));return function(n,r){for(var o="",i=n||{},a=r||{},u=a.pretty?R:encodeURIComponent,c=0;c<t.length;c++){var s=t[c];if("string"!=typeof s){var p,f=i[s.name];if(null==f){if(s.optional){s.partial&&(o+=s.prefix);continue}throw new TypeError('Expected "'+s.name+'" to be defined')}if(Vt(f)){if(!s.repeat)throw new TypeError('Expected "'+s.name+'" to not repeat, but received `'+JSON.stringify(f)+"`");if(0===f.length){if(s.optional)continue;throw new TypeError('Expected "'+s.name+'" to not be empty')}for(var h=0;h<f.length;h++){if(p=u(f[h]),!e[c].test(p))throw new TypeError('Expected all "'+s.name+'" to match "'+s.pattern+'", but received `'+JSON.stringify(p)+"`");o+=(0===h?s.prefix:s.delimiter)+p}}else{if(p=s.asterisk?O(f):u(f),!e[c].test(p))throw new TypeError('Expected "'+s.name+'" to match "'+s.pattern+'", but received "'+p+'"');o+=s.prefix+p}}else o+=s}return o}}function C(t){return t.replace(/([.+*?=^!:${}()[\]|\/\\])/g,"\\$1")}function A(t){return t.replace(/([=!:$\/()])/g,"\\$1")}function j(t,e){return t.keys=e,t}function T(t){return t.sensitive?"":"i"}function $(t,e){var n=t.source.match(/\((?!\?)/g);if(n)for(var r=0;r<n.length;r++)e.push({name:r,prefix:null,delimiter:null,optional:!1,repeat:!1,partial:!1,asterisk:!1,pattern:null});return j(t,e)}function S(t,e,n){for(var r=[],o=0;o<t.length;o++)r.push(P(t[o],e,n).source);return j(new RegExp("(?:"+r.join("|")+")",T(n)),e)}function L(t,e,n){return q(k(t,n),e,n)}function q(t,e,n){Vt(e)||(n=e||n,e=[]),n=n||{};for(var r=n.strict,o=!1!==n.end,i="",a=0;a<t.length;a++){var u=t[a];if("string"==typeof u)i+=C(u);else{var c=C(u.prefix),s="(?:"+u.pattern+")";e.push(u),u.repeat&&(s+="(?:"+c+s+")*"),s=u.optional?u.partial?c+"("+s+")?":"(?:"+c+"("+s+"))?":c+"("+s+")",i+=s}}var p=C(n.delimiter||"/"),f=i.slice(-p.length)===p;return r||(i=(f?i.slice(0,-p.length):i)+"(?:"+p+"(?=$))?"),i+=o?"$":r&&f?"":"(?="+p+"|$)",j(new RegExp("^"+i,T(n)),e)}function P(t,e,n){return Vt(e)||(n=e||n,e=[]),n=n||{},t instanceof RegExp?$(t,e):Vt(t)?S(t,e,n):L(t,e,n)}function U(t,e,n){try{return(Qt[t]||(Qt[t]=Yt.compile(t)))(e||{},{pretty:!0})}catch(t){return""}}function H(t,e,n,r){var o=e||[],i=n||Object.create(null),a=r||Object.create(null);t.forEach(function(t){M(o,i,a,t)});for(var u=0,c=o.length;u<c;u++)"*"===o[u]&&(o.push(o.splice(u,1)[0]),c--,u--);return{pathList:o,pathMap:i,nameMap:a}}function M(t,e,n,r,o,i){var a=r.path,u=r.name,c=z(a,o),s=r.pathToRegexpOptions||{};"boolean"==typeof r.caseSensitive&&(s.sensitive=r.caseSensitive);var p={path:c,regex:I(c,s),components:r.components||{default:r.component},instances:{},name:u,parent:o,matchAs:i,redirect:r.redirect,beforeEnter:r.beforeEnter,meta:r.meta||{},props:null==r.props?{}:r.components?r.props:{default:r.props}};if(r.children&&r.children.forEach(function(r){var o=i?x(i+"/"+r.path):void 0;M(t,e,n,r,p,o)}),void 0!==r.alias){(Array.isArray(r.alias)?r.alias:[r.alias]).forEach(function(i){var a={path:i,children:r.children};M(t,e,n,a,o,p.path||"/")})}e[p.path]||(t.push(p.path),e[p.path]=p),u&&(n[u]||(n[u]=p))}function I(t,e){var n=Yt(t,[],e);return n}function z(t,e){return t=t.replace(/\/$/,""),"/"===t[0]?t:null==e?t:x(e.path+"/"+t)}function B(t,e,n,r){var o="string"==typeof t?{path:t}:t;if(o.name||o._normalized)return o;if(!o.path&&o.params&&e){o=V({},o),o._normalized=!0;var i=V(V({},e.params),o.params);if(e.name)o.name=e.name,o.params=i;else if(e.matched.length){var u=e.matched[e.matched.length-1].path;o.path=U(u,i,"path "+e.path)}return o}var c=w(o.path||""),s=e&&e.path||"/",p=c.path?b(c.path,s,n||o.append):s,f=a(c.query,o.query,r&&r.options.parseQuery),h=o.hash||c.hash;return h&&"#"!==h.charAt(0)&&(h="#"+h),{_normalized:!0,path:p,query:f,hash:h}}function V(t,e){for(var n in e)t[n]=e[n];return t}function Y(t,e){function n(t){H(t,c,p,f)}function r(t,n,r){var o=B(t,n,!1,e),i=o.name;if(i){var u=f[i];if(!u)return a(null,o);var s=u.regex.keys.filter(function(t){return!t.optional}).map(function(t){return t.name});if("object"!=typeof o.params&&(o.params={}),n&&"object"==typeof n.params)for(var h in n.params)!(h in o.params)&&s.indexOf(h)>-1&&(o.params[h]=n.params[h]);if(u)return o.path=U(u.path,o.params,'named route "'+i+'"'),a(u,o,r)}else if(o.path){o.params={};for(var l=0;l<c.length;l++){var d=c[l],v=p[d];if(D(v.regex,o.path,o.params))return a(v,o,r)}}return a(null,o)}function o(t,n){var o=t.redirect,i="function"==typeof o?o(s(t,n,null,e)):o;if("string"==typeof i&&(i={path:i}),!i||"object"!=typeof i)return a(null,n);var u=i,c=u.name,p=u.path,h=n.query,l=n.hash,d=n.params;if(h=u.hasOwnProperty("query")?u.query:h,l=u.hasOwnProperty("hash")?u.hash:l,d=u.hasOwnProperty("params")?u.params:d,c){f[c];return r({_normalized:!0,name:c,query:h,hash:l,params:d},void 0,n)}if(p){var v=F(p,t);return r({_normalized:!0,path:U(v,d,'redirect route with path "'+v+'"'),query:h,hash:l},void 0,n)}return a(null,n)}function i(t,e,n){var o=U(n,e.params,'aliased route with path "'+n+'"'),i=r({_normalized:!0,path:o});if(i){var u=i.matched,c=u[u.length-1];return e.params=i.params,a(c,e)}return a(null,e)}function a(t,n,r){return t&&t.redirect?o(t,r||n):t&&t.matchAs?i(t,n,t.matchAs):s(t,n,r,e)}var u=H(t),c=u.pathList,p=u.pathMap,f=u.nameMap;return{match:r,addRoutes:n}}function D(t,e,n){var r=e.match(t);if(!r)return!1;if(!n)return!0;for(var o=1,i=r.length;o<i;++o){var a=t.keys[o-1],u="string"==typeof r[o]?decodeURIComponent(r[o]):r[o];a&&(n[a.name]=u)}return!0}function F(t,e){return b(t,e.parent?e.parent.path:"/",!0)}function K(){window.addEventListener("popstate",function(t){N(),t.state&&t.state.key&&rt(t.state.key)})}function J(t,e,n,r){if(t.app){var o=t.options.scrollBehavior;o&&t.app.$nextTick(function(){var t=Q(),i=o(e,n,r?t:null);if(i){var a="object"==typeof i;if(a&&"string"==typeof i.selector){var u=document.querySelector(i.selector);if(u){var c=i.offset&&"object"==typeof i.offset?i.offset:{};c=Z(c),t=X(u,c)}else W(i)&&(t=G(i))}else a&&W(i)&&(t=G(i));t&&window.scrollTo(t.x,t.y)}})}}function N(){var t=nt();t&&(Xt[t]={x:window.pageXOffset,y:window.pageYOffset})}function Q(){var t=nt();if(t)return Xt[t]}function X(t,e){var n=document.documentElement,r=n.getBoundingClientRect(),o=t.getBoundingClientRect();return{x:o.left-r.left-e.x,y:o.top-r.top-e.y}}function W(t){return tt(t.x)||tt(t.y)}function G(t){return{x:tt(t.x)?t.x:window.pageXOffset,y:tt(t.y)?t.y:window.pageYOffset}}function Z(t){return{x:tt(t.x)?t.x:0,y:tt(t.y)?t.y:0}}function tt(t){return"number"==typeof t}function et(){return Gt.now().toFixed(3)}function nt(){return Zt}function rt(t){Zt=t}function ot(t,e){N();var n=window.history;try{e?n.replaceState({key:Zt},"",t):(Zt=et(),n.pushState({key:Zt},"",t))}catch(n){window.location[e?"replace":"assign"](t)}}function it(t){ot(t,!0)}function at(t,e,n){var r=function(o){o>=t.length?n():t[o]?e(t[o],function(){r(o+1)}):r(o+1)};r(0)}function ut(t){return function(e,n,r){var i=!1,a=0,u=null;ct(t,function(t,e,n,c){if("function"==typeof t&&void 0===t.cid){i=!0,a++;var s,p=pt(function(e){e.__esModule&&e.default&&(e=e.default),t.resolved="function"==typeof e?e:jt.extend(e),n.components[c]=e,--a<=0&&r()}),f=pt(function(t){var e="Failed to resolve async component "+c+": "+t;u||(u=o(t)?t:new Error(e),r(u))});try{s=t(p,f)}catch(t){f(t)}if(s)if("function"==typeof s.then)s.then(p,f);else{var h=s.component;h&&"function"==typeof h.then&&h.then(p,f)}}}),i||r()}}function ct(t,e){return st(t.map(function(t){return Object.keys(t.components).map(function(n){return e(t.components[n],t.instances[n],t,n)})}))}function st(t){return Array.prototype.concat.apply([],t)}function pt(t){var e=!1;return function(){for(var n=[],r=arguments.length;r--;)n[r]=arguments[r];if(!e)return e=!0,t.apply(this,n)}}function ft(t){if(!t)if(Bt){var e=document.querySelector("base");t=e&&e.getAttribute("href")||"/",t=t.replace(/^https?:\/\/[^\/]+/,"")}else t="/";return"/"!==t.charAt(0)&&(t="/"+t),t.replace(/\/$/,"")}function ht(t,e){var n,r=Math.max(t.length,e.length);for(n=0;n<r&&t[n]===e[n];n++);return{updated:e.slice(0,n),activated:e.slice(n),deactivated:t.slice(n)}}function lt(t,e,n,r){var o=ct(t,function(t,r,o,i){var a=dt(t,e);if(a)return Array.isArray(a)?a.map(function(t){return n(t,r,o,i)}):n(a,r,o,i)});return st(r?o.reverse():o)}function dt(t,e){return"function"!=typeof t&&(t=jt.extend(t)),t.options[e]}function vt(t){return lt(t,"beforeRouteLeave",mt,!0)}function yt(t){return lt(t,"beforeRouteUpdate",mt)}function mt(t,e){if(e)return function(){return t.apply(e,arguments)}}function gt(t,e,n){return lt(t,"beforeRouteEnter",function(t,r,o,i){return bt(t,o,i,e,n)})}function bt(t,e,n,r,o){return function(i,a,u){return t(i,a,function(t){u(t),"function"==typeof t&&r.push(function(){wt(t,e.instances,n,o)})})}}function wt(t,e,n,r){e[n]?t(e[n]):r()&&setTimeout(function(){wt(t,e,n,r)},16)}function xt(t){var e=window.location.pathname;return t&&0===e.indexOf(t)&&(e=e.slice(t.length)),(e||"/")+window.location.search+window.location.hash}function kt(t){var e=xt(t);if(!/^\/#/.test(e))return window.location.replace(x(t+"/#"+e)),!0}function Et(){var t=Rt();return"/"===t.charAt(0)||(_t("/"+t),!1)}function Rt(){var t=window.location.href,e=t.indexOf("#");return-1===e?"":t.slice(e+1)}function Ot(t){window.location.hash=t}function _t(t){var e=window.location.href,n=e.indexOf("#"),r=n>=0?e.slice(0,n):e;window.location.replace(r+"#"+t)}function Ct(t,e){return t.push(e),function(){var n=t.indexOf(e);n>-1&&t.splice(n,1)}}function At(t,e,n){var r="hash"===n?"#"+e:e;return t?x(t+"/"+r):r}var jt,Tt={name:"router-view",functional:!0,props:{name:{type:String,default:"default"}},render:function(t,e){var n=e.props,r=e.children,o=e.parent,a=e.data;a.routerView=!0;for(var u=o.$createElement,c=n.name,s=o.$route,p=o._routerViewCache||(o._routerViewCache={}),f=0,h=!1;o&&o._routerRoot!==o;)o.$vnode&&o.$vnode.data.routerView&&f++,o._inactive&&(h=!0),o=o.$parent;if(a.routerViewDepth=f,h)return u(p[c],a,r);var l=s.matched[f];if(!l)return p[c]=null,u();var d=p[c]=l.components[c];return a.registerRouteInstance=function(t,e){var n=l.instances[c];(e&&n!==t||!e&&n===t)&&(l.instances[c]=e)},(a.hook||(a.hook={})).prepatch=function(t,e){l.instances[c]=e.componentInstance},a.props=i(s,l.props&&l.props[c]),u(d,a,r)}},$t=/[!'()*]/g,St=function(t){return"%"+t.charCodeAt(0).toString(16)},Lt=/%2C/g,qt=function(t){return encodeURIComponent(t).replace($t,St).replace(Lt,",")},Pt=decodeURIComponent,Ut=/\/?$/,Ht=s(null,{path:"/"}),Mt=[String,Object],It=[String,Array],zt={name:"router-link",props:{to:{type:Mt,required:!0},tag:{type:String,default:"a"},exact:Boolean,append:Boolean,replace:Boolean,activeClass:String,exactActiveClass:String,event:{type:It,default:"click"}},render:function(t){var e=this,n=this.$router,r=this.$route,o=n.resolve(this.to,r,this.append),i=o.location,a=o.route,u=o.href,c={},p=n.options.linkActiveClass,f=n.options.linkExactActiveClass,l=null==p?"router-link-active":p,v=null==f?"router-link-exact-active":f,g=null==this.activeClass?l:this.activeClass,b=null==this.exactActiveClass?v:this.exactActiveClass,w=i.path?s(null,i,null,n):a;c[b]=h(r,w),c[g]=this.exact?c[b]:d(r,w);var x=function(t){y(t)&&(e.replace?n.replace(i):n.push(i))},k={click:y};Array.isArray(this.event)?this.event.forEach(function(t){k[t]=x}):k[this.event]=x;var E={class:c};if("a"===this.tag)E.on=k,E.attrs={href:u};else{var R=m(this.$slots.default);if(R){R.isStatic=!1;var O=jt.util.extend;(R.data=O({},R.data)).on=k;(R.data.attrs=O({},R.data.attrs)).href=u}else E.on=k}return t(this.tag,E,this.$slots.default)}},Bt="undefined"!=typeof window,Vt=Array.isArray||function(t){return"[object Array]"==Object.prototype.toString.call(t)},Yt=P,Dt=k,Ft=E,Kt=_,Jt=q,Nt=new RegExp(["(\\\\.)","([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"].join("|"),"g");Yt.parse=Dt,Yt.compile=Ft,Yt.tokensToFunction=Kt,Yt.tokensToRegExp=Jt;var Qt=Object.create(null),Xt=Object.create(null),Wt=Bt&&function(){var t=window.navigator.userAgent;return(-1===t.indexOf("Android 2.")&&-1===t.indexOf("Android 4.0")||-1===t.indexOf("Mobile Safari")||-1!==t.indexOf("Chrome")||-1!==t.indexOf("Windows Phone"))&&(window.history&&"pushState"in window.history)}(),Gt=Bt&&window.performance&&window.performance.now?window.performance:Date,Zt=et(),te=function(t,e){this.router=t,this.base=ft(e),this.current=Ht,this.pending=null,this.ready=!1,this.readyCbs=[],this.readyErrorCbs=[],this.errorCbs=[]};te.prototype.listen=function(t){this.cb=t},te.prototype.onReady=function(t,e){this.ready?t():(this.readyCbs.push(t),e&&this.readyErrorCbs.push(e))},te.prototype.onError=function(t){this.errorCbs.push(t)},te.prototype.transitionTo=function(t,e,n){var r=this,o=this.router.match(t,this.current);this.confirmTransition(o,function(){r.updateRoute(o),e&&e(o),r.ensureURL(),r.ready||(r.ready=!0,r.readyCbs.forEach(function(t){t(o)}))},function(t){n&&n(t),t&&!r.ready&&(r.ready=!0,r.readyErrorCbs.forEach(function(e){e(t)}))})},te.prototype.confirmTransition=function(t,e,n){var i=this,a=this.current,u=function(t){o(t)&&(i.errorCbs.length?i.errorCbs.forEach(function(e){e(t)}):(r(!1,"uncaught error during route navigation:"),console.error(t))),n&&n(t)};if(h(t,a)&&t.matched.length===a.matched.length)return this.ensureURL(),u();var c=ht(this.current.matched,t.matched),s=c.updated,p=c.deactivated,f=c.activated,l=[].concat(vt(p),this.router.beforeHooks,yt(s),f.map(function(t){return t.beforeEnter}),ut(f));this.pending=t;var d=function(e,n){if(i.pending!==t)return u();try{e(t,a,function(t){!1===t||o(t)?(i.ensureURL(!0),u(t)):"string"==typeof t||"object"==typeof t&&("string"==typeof t.path||"string"==typeof t.name)?(u(),"object"==typeof t&&t.replace?i.replace(t):i.push(t)):n(t)})}catch(t){u(t)}};at(l,d,function(){var n=[];at(gt(f,n,function(){return i.current===t}).concat(i.router.resolveHooks),d,function(){if(i.pending!==t)return u();i.pending=null,e(t),i.router.app&&i.router.app.$nextTick(function(){n.forEach(function(t){t()})})})})},te.prototype.updateRoute=function(t){var e=this.current;this.current=t,this.cb&&this.cb(t),this.router.afterHooks.forEach(function(n){n&&n(t,e)})};var ee=function(t){function e(e,n){var r=this;t.call(this,e,n);var o=e.options.scrollBehavior;o&&K(),window.addEventListener("popstate",function(t){var n=r.current;r.transitionTo(xt(r.base),function(t){o&&J(e,t,n,!0)})})}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.go=function(t){window.history.go(t)},e.prototype.push=function(t,e,n){var r=this,o=this,i=o.current;this.transitionTo(t,function(t){ot(x(r.base+t.fullPath)),J(r.router,t,i,!1),e&&e(t)},n)},e.prototype.replace=function(t,e,n){var r=this,o=this,i=o.current;this.transitionTo(t,function(t){it(x(r.base+t.fullPath)),J(r.router,t,i,!1),e&&e(t)},n)},e.prototype.ensureURL=function(t){if(xt(this.base)!==this.current.fullPath){var e=x(this.base+this.current.fullPath);t?ot(e):it(e)}},e.prototype.getCurrentLocation=function(){return xt(this.base)},e}(te),ne=function(t){function e(e,n,r){t.call(this,e,n),r&&kt(this.base)||Et()}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.setupListeners=function(){var t=this;window.addEventListener("hashchange",function(){Et()&&t.transitionTo(Rt(),function(t){_t(t.fullPath)})})},e.prototype.push=function(t,e,n){this.transitionTo(t,function(t){Ot(t.fullPath),e&&e(t)},n)},e.prototype.replace=function(t,e,n){this.transitionTo(t,function(t){_t(t.fullPath),e&&e(t)},n)},e.prototype.go=function(t){window.history.go(t)},e.prototype.ensureURL=function(t){var e=this.current.fullPath;Rt()!==e&&(t?Ot(e):_t(e))},e.prototype.getCurrentLocation=function(){return Rt()},e}(te),re=function(t){function e(e,n){t.call(this,e,n),this.stack=[],this.index=-1}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.push=function(t,e,n){var r=this;this.transitionTo(t,function(t){r.stack=r.stack.slice(0,r.index+1).concat(t),r.index++,e&&e(t)},n)},e.prototype.replace=function(t,e,n){var r=this;this.transitionTo(t,function(t){r.stack=r.stack.slice(0,r.index).concat(t),e&&e(t)},n)},e.prototype.go=function(t){var e=this,n=this.index+t;if(!(n<0||n>=this.stack.length)){var r=this.stack[n];this.confirmTransition(r,function(){e.index=n,e.updateRoute(r)})}},e.prototype.getCurrentLocation=function(){var t=this.stack[this.stack.length-1];return t?t.fullPath:"/"},e.prototype.ensureURL=function(){},e}(te),oe=function(t){void 0===t&&(t={}),this.app=null,this.apps=[],this.options=t,this.beforeHooks=[],this.resolveHooks=[],this.afterHooks=[],this.matcher=Y(t.routes||[],this);var e=t.mode||"hash";switch(this.fallback="history"===e&&!Wt&&!1!==t.fallback,this.fallback&&(e="hash"),Bt||(e="abstract"),this.mode=e,e){case"history":this.history=new ee(this,t.base);break;case"hash":this.history=new ne(this,t.base,this.fallback);break;case"abstract":this.history=new re(this,t.base)}},ie={currentRoute:{}};oe.prototype.match=function(t,e,n){return this.matcher.match(t,e,n)},ie.currentRoute.get=function(){return this.history&&this.history.current},oe.prototype.init=function(t){var e=this;if(this.apps.push(t),!this.app){this.app=t;var n=this.history;if(n instanceof ee)n.transitionTo(n.getCurrentLocation());else if(n instanceof ne){var r=function(){n.setupListeners()};n.transitionTo(n.getCurrentLocation(),r,r)}n.listen(function(t){e.apps.forEach(function(e){e._route=t})})}},oe.prototype.beforeEach=function(t){return Ct(this.beforeHooks,t)},oe.prototype.beforeResolve=function(t){return Ct(this.resolveHooks,t)},oe.prototype.afterEach=function(t){return Ct(this.afterHooks,t)},oe.prototype.onReady=function(t,e){this.history.onReady(t,e)},oe.prototype.onError=function(t){this.history.onError(t)},oe.prototype.push=function(t,e,n){this.history.push(t,e,n)},oe.prototype.replace=function(t,e,n){this.history.replace(t,e,n)},oe.prototype.go=function(t){this.history.go(t)},oe.prototype.back=function(){this.go(-1)},oe.prototype.forward=function(){this.go(1)},oe.prototype.getMatchedComponents=function(t){var e=t?t.matched?t:this.resolve(t).route:this.currentRoute;return e?[].concat.apply([],e.matched.map(function(t){return Object.keys(t.components).map(function(e){return t.components[e]})})):[]},oe.prototype.resolve=function(t,e,n){var r=B(t,e||this.history.current,n,this),o=this.match(r,e),i=o.redirectedFrom||o.fullPath;return{location:r,route:o,href:At(this.history.base,i,this.mode),normalizedTo:r,resolved:o}},oe.prototype.addRoutes=function(t){this.matcher.addRoutes(t),this.history.current!==Ht&&this.history.transitionTo(this.history.getCurrentLocation())},Object.defineProperties(oe.prototype,ie),oe.install=g,oe.version="2.7.0",Bt&&window.Vue&&window.Vue.use(oe),e.a=oe},69:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(39),o=n.n(r);e.default={data:function(){return{}},methods:{preventScroll:function(){this.$nextTick(function(){setTimeout(function(){o()(document.querySelectorAll(".l-page")).forEach(function(t){var e=t.querySelector(".l-page-body"),n={posY:0,maxscroll:0};e&&(t.addEventListener("touchstart",function(t){var r=t.touches[0]||t;n.posY=r.pageY,n.scrollY=e.scrollTop,n.maxscroll=e.scrollHeight-e.clientHeight},!1),t.addEventListener("touchmove",function(t){var r=t.touches[0]||t;n.maxscroll<=0&&t.preventDefault();var o=r.pageY-n.posY;return o>0&&0==e.scrollTop?void event.preventDefault():o<0&&e.scrollTop+1>=n.maxscroll?void event.preventDefault():void 0},!1),t.addEventListener("touchend",function(t){n.maxscroll=0},!1))})},700)})}},mounted:function(){this.preventScroll()}}},71:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(24),o=n(64),i=n(56),a=n(63),u=n.n(a);r.a.use(o.a);var c=new o.a({routes:i.a,mode:"history",scrollBehavior:function(t,e,n){}});c.beforeEach(function(t,e,n){n()}),c.afterEach(function(t){}),c.onReady(function(){}),new r.a({router:c,render:function(t){return t(u.a)}}).$mount("#app")}},[71]);