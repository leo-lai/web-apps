webpackJsonp([4],{553:function(t,e,a){a(607);var i=a(151)(a(585),a(641),"data-v-3a881d7b",null);t.exports=i.exports},585:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a(611),s=a.n(i);e.default={components:{CountTo:s.a},name:"index",data:function(){return{}},mounted:function(){}}},599:function(t,e,a){e=t.exports=a(547)(),e.push([t.i,'li[data-v-3a881d7b],ul[data-v-3a881d7b]{margin:0;padding:0;list-style:none}.l-index-store[data-v-3a881d7b]{background:url("/static/20171108102839.jpg") no-repeat right 50%;background-size:100% 100%}.l-list-text li[data-v-3a881d7b]{margin:3px 0}.l-circle-step[data-v-3a881d7b]{overflow:hidden;text-align:center}.l-circle-step ._item[data-v-3a881d7b]{float:left;text-align:center;margin:.75rem .25rem;min-width:178px}.l-circle-step ._circle[data-v-3a881d7b]{border:10px solid #eff2f7;border-radius:50%;position:relative;color:rgba(71,86,105,.8);width:100px;height:100px;margin:0 auto 10px;font-size:.6rem;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.l-circle-step ._circle[data-v-3a881d7b]:after,.l-circle-step ._circle[data-v-3a881d7b]:before{content:"";border-top:1px solid #eff2f7;width:50%;position:absolute;top:50%}.l-circle-step ._circle[data-v-3a881d7b]:before{left:-50%}.l-circle-step ._circle[data-v-3a881d7b]:after{right:-50%}.l-circle-step ._num[data-v-3a881d7b]{font-size:1rem;color:#21a0ff;margin-right:2px;font-weight:600}.l-circle-step ._item:first-child ._circle[data-v-3a881d7b]:before,.l-circle-step ._item:last-child ._circle[data-v-3a881d7b]:after{visibility:hidden}.l-list-shengyi[data-v-3a881d7b]{overflow:hidden}.l-list-shengyi ._item[data-v-3a881d7b]{float:left;padding:0 3rem;margin:.75rem 0;border-right:1px solid #c1ccda}.l-list-shengyi ._item[data-v-3a881d7b]:last-child{border-right:none}.l-list-shengyi ._num[data-v-3a881d7b]{font-size:1.5rem;color:#21a0ff;margin:.75rem 0}.l-list-shengyi ._old[data-v-3a881d7b]{color:#ccc}.l-list-shengyi ._old i[data-v-3a881d7b]{margin-left:10px;color:#ff4949}',"",{version:3,sources:["C:/Users/leo/Desktop/my jobs/web-apps/src/xifengniao/admin/pages/index.vue"],names:[],mappings:"AACA,wCAEE,SAAU,AACV,UAAW,AACX,eAAiB,CAClB,AACD,gCACE,iEAAkE,AAClE,yBAA2B,CAC5B,AACD,iCACE,YAAc,CACf,AACD,gCACE,gBAAiB,AACjB,iBAAmB,CACpB,AACD,uCACE,WAAY,AACZ,kBAAmB,AACnB,qBAAwB,AACxB,eAAiB,CAClB,AACD,yCACE,0BAA2B,AAC3B,kBAAmB,AACnB,kBAAmB,AACnB,yBAA8B,AAC9B,YAAa,AACb,aAAc,AACd,mBAAoB,AACpB,gBAAkB,AAClB,oBAAqB,AACrB,qBAAsB,AACtB,oBAAqB,AACrB,aAAc,AACd,yBAA0B,AACd,sBAAuB,AAC3B,mBAAoB,AAC5B,wBAAyB,AACb,qBAAsB,AAC1B,sBAAwB,CACjC,AACD,+FAEE,WAAY,AACZ,6BAA8B,AAC9B,UAAW,AACX,kBAAmB,AACnB,OAAS,CACV,AACD,gDACE,SAAW,CACZ,AACD,+CACE,UAAY,CACb,AACD,sCACE,eAAgB,AAChB,cAAe,AACf,iBAAkB,AAClB,eAAiB,CAClB,AACD,oIAEE,iBAAmB,CACpB,AACD,iCACE,eAAiB,CAClB,AACD,wCACE,WAAY,AACZ,eAAgB,AAChB,gBAAkB,AAClB,8BAAgC,CACjC,AACD,mDACE,iBAAmB,CACpB,AACD,uCACE,iBAAkB,AAClB,cAAe,AACf,eAAkB,CACnB,AACD,uCACE,UAAY,CACb,AACD,yCACE,iBAAkB,AAClB,aAAe,CAChB",file:"index.vue",sourcesContent:["\nul[data-v-3a881d7b],\nli[data-v-3a881d7b] {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.l-index-store[data-v-3a881d7b] {\n  background: url('/static/20171108102839.jpg') no-repeat right 50%;\n  background-size: 100% 100%;\n}\n.l-list-text li[data-v-3a881d7b] {\n  margin: 3px 0;\n}\n.l-circle-step[data-v-3a881d7b] {\n  overflow: hidden;\n  text-align: center;\n}\n.l-circle-step ._item[data-v-3a881d7b] {\n  float: left;\n  text-align: center;\n  margin: 0.75rem 0.25rem;\n  min-width: 178px;\n}\n.l-circle-step ._circle[data-v-3a881d7b] {\n  border: 10px solid #eff2f7;\n  border-radius: 50%;\n  position: relative;\n  color: rgba(71, 86, 105, 0.8);\n  width: 100px;\n  height: 100px;\n  margin: 0 auto 10px;\n  font-size: 0.6rem;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n              -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n              -ms-flex-pack: center;\n          justify-content: center;\n}\n.l-circle-step ._circle[data-v-3a881d7b]::before,\n.l-circle-step ._circle[data-v-3a881d7b]::after {\n  content: '';\n  border-top: 1px solid #eff2f7;\n  width: 50%;\n  position: absolute;\n  top: 50%;\n}\n.l-circle-step ._circle[data-v-3a881d7b]::before {\n  left: -50%;\n}\n.l-circle-step ._circle[data-v-3a881d7b]::after {\n  right: -50%;\n}\n.l-circle-step ._num[data-v-3a881d7b] {\n  font-size: 1rem;\n  color: #21a0ff;\n  margin-right: 2px;\n  font-weight: 600;\n}\n.l-circle-step ._item:first-child ._circle[data-v-3a881d7b]::before,\n.l-circle-step ._item:last-child ._circle[data-v-3a881d7b]::after {\n  visibility: hidden;\n}\n.l-list-shengyi[data-v-3a881d7b] {\n  overflow: hidden;\n}\n.l-list-shengyi ._item[data-v-3a881d7b] {\n  float: left;\n  padding: 0 3rem;\n  margin: 0.75rem 0;\n  border-right: 1px solid #c1ccda;\n}\n.l-list-shengyi ._item[data-v-3a881d7b]:last-child {\n  border-right: none;\n}\n.l-list-shengyi ._num[data-v-3a881d7b] {\n  font-size: 1.5rem;\n  color: #21a0ff;\n  margin: 0.75rem 0;\n}\n.l-list-shengyi ._old[data-v-3a881d7b] {\n  color: #ccc;\n}\n.l-list-shengyi ._old i[data-v-3a881d7b] {\n  margin-left: 10px;\n  color: #ff4949;\n}\n"],sourceRoot:""}])},607:function(t,e,a){var i=a(599);"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);a(548)("0b213f30",i,!0)},611:function(t,e,a){!function(e,a){t.exports=a()}(0,function(){return function(t){function e(i){if(a[i])return a[i].exports;var s=a[i]={i:i,l:!1,exports:{}};return t[i].call(s.exports,s,s.exports,e),s.l=!0,s.exports}var a={};return e.m=t,e.c=a,e.i=function(t){return t},e.d=function(t,a,i){e.o(t,a)||Object.defineProperty(t,a,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var a=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(a,"a",a),a},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/dist/",e(e.s=2)}([function(t,e,a){var i=a(4)(a(1),a(5),null,null);t.exports=i.exports},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a(3);e.default={props:{startVal:{type:Number,required:!1,default:0},endVal:{type:Number,required:!1,default:2017},duration:{type:Number,required:!1,default:3e3},autoplay:{type:Boolean,required:!1,default:!0},decimals:{type:Number,required:!1,default:0,validator:function(t){return t>=0}},decimal:{type:String,required:!1,default:"."},separator:{type:String,required:!1,default:","},prefix:{type:String,required:!1,default:""},suffix:{type:String,required:!1,default:""},useEasing:{type:Boolean,required:!1,default:!0},easingFn:{type:Function,default:function(t,e,a,i){return a*(1-Math.pow(2,-10*t/i))*1024/1023+e}}},data:function(){return{localStartVal:this.startVal,displayValue:this.formatNumber(this.startVal),printVal:null,paused:!1,localDuration:this.duration,startTime:null,timestamp:null,remaining:null,rAF:null}},computed:{countDown:function(){return this.startVal>this.endVal}},mounted:function(){this.autoplay&&this.start(),this.$emit("mountedCallback")},methods:{start:function(){this.localStartVal=this.startVal,this.startTime=null,this.localDuration=this.duration,this.paused=!1,this.rAF=(0,i.requestAnimationFrame)(this.count)},pauseResume:function(){this.paused?(this.resume(),this.paused=!1):(this.pause(),this.paused=!0)},pause:function(){(0,i.cancelAnimationFrame)(this.rAF)},resume:function(){this.startTime=null,this.localDuration=+this.remaining,this.localStartVal=+this.printVal,(0,i.requestAnimationFrame)(this.count)},reset:function(){this.startTime=null,(0,i.cancelAnimationFrame)(this.rAF),this.displayValue=this.formatNumber(this.startVal)},count:function(t){this.startTime||(this.startTime=t),this.timestamp=t;var e=t-this.startTime;this.remaining=this.localDuration-e,this.useEasing?this.countDown?this.printVal=this.localStartVal-this.easingFn(e,0,this.localStartVal-this.endVal,this.localDuration):this.printVal=this.easingFn(e,this.localStartVal,this.endVal-this.localStartVal,this.localDuration):this.countDown?this.printVal=this.localStartVal-(this.localStartVal-this.endVal)*(e/this.localDuration):this.printVal=this.localStartVal+(this.localStartVal-this.startVal)*(e/this.localDuration),this.countDown?this.printVal=this.printVal<this.endVal?this.endVal:this.printVal:this.printVal=this.printVal>this.endVal?this.endVal:this.printVal,this.displayValue=this.formatNumber(this.printVal),e<this.localDuration?this.rAF=(0,i.requestAnimationFrame)(this.count):this.$emit("callback")},isNumber:function(t){return!isNaN(parseFloat(t))},formatNumber:function(t){t=t.toFixed(this.decimals),t+="";var e=t.split("."),a=e[0],i=e.length>1?this.decimal+e[1]:"",s=/(\d+)(\d{3})/;if(this.separator&&!this.isNumber(this.separator))for(;s.test(a);)a=a.replace(s,"$1"+this.separator+"$2");return this.prefix+a+i+this.suffix}},destroyed:function(){(0,i.cancelAnimationFrame)(this.rAF)}}},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a(0),s=function(t){return t&&t.__esModule?t:{default:t}}(i);e.default=s.default,"undefined"!=typeof window&&window.Vue&&window.Vue.component("count-to",s.default)},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=0,s="webkit moz ms o".split(" "),n=void 0,l=void 0;if("undefined"==typeof window)e.requestAnimationFrame=n=function(){},e.cancelAnimationFrame=l=function(){};else{e.requestAnimationFrame=n=window.requestAnimationFrame,e.cancelAnimationFrame=l=window.cancelAnimationFrame;for(var r=void 0,c=0;c<s.length&&(!n||!l);c++)r=s[c],e.requestAnimationFrame=n=n||window[r+"RequestAnimationFrame"],e.cancelAnimationFrame=l=l||window[r+"CancelAnimationFrame"]||window[r+"CancelRequestAnimationFrame"];n&&l||(e.requestAnimationFrame=n=function(t){var e=(new Date).getTime(),a=Math.max(0,16-(e-i)),s=window.setTimeout(function(){t(e+a)},a);return i=e+a,s},e.cancelAnimationFrame=l=function(t){window.clearTimeout(t)})}e.requestAnimationFrame=n,e.cancelAnimationFrame=l},function(t,e){t.exports=function(t,e,a,i){var s,n=t=t||{},l=typeof t.default;"object"!==l&&"function"!==l||(s=t,n=t.default);var r="function"==typeof n?n.options:n;if(e&&(r.render=e.render,r.staticRenderFns=e.staticRenderFns),a&&(r._scopeId=a),i){var c=Object.create(r.computed||null);Object.keys(i).forEach(function(t){var e=i[t];c[t]=function(){return e}}),r.computed=c}return{esModule:s,exports:n,options:r}}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("span",[t._v("\n  "+t._s(t.displayValue)+"\n")])},staticRenderFns:[]}}])})},641:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"l-main-body"},[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:16}},[a("el-card",{staticClass:"l-index-store",staticStyle:{height:"190px"}},[a("div",{staticClass:"l-flex-h"},[a("img",{staticClass:"l-margin-r",attrs:{width:"150",height:"150",src:"http://iph.href.lu/150x150?text=LOGO"}}),t._v(" "),a("div",{staticClass:"l-rest"},[a("h3",[t._v("骏哼旗舰店")]),t._v(" "),a("p",{staticClass:"l-margin-tb-m l-text-gray"},[t._v("门店")]),t._v(" "),a("p",{staticClass:"l-margin-tb-m l-text-gray"},[t._v("广东省江门市鹤山2009号")]),t._v(" "),a("p",[a("a",{staticClass:"l-text-link"},[t._v("更改基础设置")])])])])])],1),t._v(" "),a("el-col",{attrs:{span:8}},[a("el-card",{staticStyle:{height:"190px"}},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("b",[t._v("公告/通知")]),t._v(" "),a("el-button",{staticClass:"l-fr",attrs:{type:"text"}},[t._v("查看全部")])],1),t._v(" "),a("ul",{staticClass:"l-list-text"},[a("li",[t._v("系统使用说明及操作文档下载")]),t._v(" "),a("li",[t._v("系统使用说明及操作文档下载")]),t._v(" "),a("li",[t._v("系统使用说明及操作文档下载")]),t._v(" "),a("li",[t._v("系统使用说明及操作文档下载")])])])],1)],1),t._v(" "),a("el-row",{staticClass:"l-margin-t"},[a("el-col",{attrs:{span:24}},[a("el-card",[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("b",[t._v("客户管理")]),t._v(" "),a("el-button",{staticClass:"l-fr",attrs:{type:"text"}},[t._v("查看全部")])],1),t._v(" "),a("ul",{staticClass:"l-circle-step"},[a("li",{staticClass:"_item"},[a("p",{staticClass:"_circle"},[a("b",[t._v("落定")])]),t._v(" "),a("p",[a("b",{staticClass:"_num"},[t._v("5")]),t._v("个客户落定")]),t._v(" "),a("p",[a("a",{staticClass:"l-text-link"},[t._v("查看")])])]),t._v(" "),a("li",{staticClass:"_item"},[a("p",{staticClass:"_circle"},[a("b",[t._v("车辆出库")])]),t._v(" "),a("p",[a("b",{staticClass:"_num"},[t._v("5")]),t._v("个客户车辆已出库")]),t._v(" "),a("p",[a("a",{staticClass:"l-text-link"},[t._v("查看")])])]),t._v(" "),a("li",{staticClass:"_item"},[a("p",{staticClass:"_circle"},[a("b",[t._v("完款")])]),t._v(" "),a("p",[a("b",{staticClass:"_num"},[t._v("5")]),t._v("个客户已完款")]),t._v(" "),a("p",[a("a",{staticClass:"l-text-link"},[t._v("查看")])])]),t._v(" "),a("li",{staticClass:"_item"},[a("p",{staticClass:"_circle"},[a("b",[t._v("加装/上牌")])]),t._v(" "),a("p",[a("b",{staticClass:"_num"},[t._v("5")]),t._v("台车正在加装/上牌")]),t._v(" "),a("p",[a("a",{staticClass:"l-text-link"},[t._v("查看")])])]),t._v(" "),a("li",{staticClass:"_item"},[a("p",{staticClass:"_circle"},[a("b",[t._v("交车")])]),t._v(" "),a("p",[a("b",{staticClass:"_num"},[t._v("5")]),t._v("个客户可以交车")]),t._v(" "),a("p",[a("a",{staticClass:"l-text-link"},[t._v("查看")])])]),t._v(" "),a("li",{staticClass:"_item"},[a("p",{staticClass:"_circle"},[a("b",[t._v("回访/跟踪")])]),t._v(" "),a("p",[a("b",{staticClass:"_num"},[t._v("5")]),t._v("个客户需要跟踪")]),t._v(" "),a("p",[a("a",{staticClass:"l-text-link"},[t._v("查看")])])])])])],1)],1),t._v(" "),a("el-row",{staticClass:"l-margin-t"},[a("el-col",{attrs:{span:24}},[a("el-card",[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("b",[t._v("订购车辆")]),t._v(" "),a("el-button",{staticClass:"l-fr",attrs:{type:"text"}},[t._v("查看全部")])],1),t._v(" "),a("ul",{staticClass:"l-circle-step"},[a("li",{staticClass:"_item"},[a("p",{staticClass:"_circle"},[a("b",[t._v("待处理")])]),t._v(" "),a("p",[a("b",{staticClass:"_num"},[t._v("5")]),t._v("个订单待处理")]),t._v(" "),a("p",[a("a",{staticClass:"l-text-link"},[t._v("查看")])])]),t._v(" "),a("li",{staticClass:"_item"},[a("p",{staticClass:"_circle"},[a("b",[t._v("待付尾款")])]),t._v(" "),a("p",[a("b",{staticClass:"_num"},[t._v("5")]),t._v("个订单已处理，待付尾款")]),t._v(" "),a("p",[a("a",{staticClass:"l-text-link"},[t._v("查看")])])]),t._v(" "),a("li",{staticClass:"_item"},[a("p",{staticClass:"_circle"},[a("b",[t._v("待签收入库")])]),t._v(" "),a("p",[a("b",{staticClass:"_num"},[t._v("5")]),t._v("个订单已出库，待签收")]),t._v(" "),a("p",[a("a",{staticClass:"l-text-link"},[t._v("查看")])])])])])],1)],1),t._v(" "),a("el-row",{staticClass:"l-margin-t"},[a("el-col",{attrs:{span:24}},[a("el-card",[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("b",[t._v("生意参谋")]),t._v(" "),a("el-button",{staticClass:"l-fr",attrs:{type:"text"}},[t._v("查看全部")])],1),t._v(" "),a("ul",{staticClass:"l-list-shengyi"},[a("li",{staticClass:"_item"},[a("p"),a("h3",[t._v("今日新增客户")]),a("p"),t._v(" "),a("p",{staticClass:"_num"},[a("countTo",{attrs:{startVal:0,endVal:5e3,duration:3e3}})],1),t._v(" "),a("p",{staticClass:"_old"},[t._v("比昨日"),a("i",[t._v("+8")])])]),t._v(" "),a("li",{staticClass:"_item"},[a("p"),a("h3",[t._v("今日预约到店客户")]),a("p"),t._v(" "),a("p",{staticClass:"_num"},[a("countTo",{attrs:{startVal:0,endVal:2e3,duration:3e3}})],1),t._v(" "),a("p",{staticClass:"_old"},[t._v("比昨日"),a("i",[t._v("-8")])])])])])],1)],1)],1)},staticRenderFns:[]}}});