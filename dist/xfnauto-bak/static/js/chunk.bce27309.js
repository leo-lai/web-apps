webpackJsonp([5],{589:function(t,e,a){a(660);var i=a(154)(a(636),a(699),"data-v-3a881d7b",null);t.exports=i.exports},636:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a(666),n=a.n(i);e.default={components:{CountTo:n.a},name:"index",data:function(){return{organization:{imageArr:[]},stockOrder:{},customerOrder:{}}},mounted:function(){var t=this;this.$$api.index.getCount().then(function(e){var a=e.data;a.organization.imageArr=a.organization.imageUrl?a.organization.imageUrl.split(","):[],t.organization=a.organization,t.stockOrder=a.stockOrder,t.customerOrder=a.customerOrderMap})}}},650:function(t,e,a){e=t.exports=a(581)(),e.push([t.i,'li[data-v-3a881d7b],ul[data-v-3a881d7b]{margin:0;padding:0;list-style:none}.l-index-store[data-v-3a881d7b]{background:url("/static/20171108102839.jpg") no-repeat right 50%;background-size:100% 100%}.l-list-text li[data-v-3a881d7b]{margin:3px 0}.l-circle-step[data-v-3a881d7b]{overflow:hidden;text-align:center}.l-circle-step ._item[data-v-3a881d7b]{float:left;text-align:center;margin:.75rem .5rem;min-width:178px}.l-circle-step ._circle[data-v-3a881d7b]{border:10px solid #eff2f7;border-radius:50%;position:relative;color:rgba(71,86,105,.8);width:100px;height:100px;margin:0 auto 10px;font-size:.6rem;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.l-circle-step ._circle[data-v-3a881d7b]:after,.l-circle-step ._circle[data-v-3a881d7b]:before{content:"";border-top:1px solid #eff2f7;width:100%;position:absolute;top:50%}.l-circle-step ._circle[data-v-3a881d7b]:before{left:-100%}.l-circle-step ._circle[data-v-3a881d7b]:after{right:-100%}.l-circle-step ._num[data-v-3a881d7b]{font-size:1rem;color:#21a0ff;margin-right:2px;font-weight:600}.l-circle-step ._item:first-child ._circle[data-v-3a881d7b]:before,.l-circle-step ._item:last-child ._circle[data-v-3a881d7b]:after{visibility:hidden}.l-list-shengyi[data-v-3a881d7b]{overflow:hidden}.l-list-shengyi ._item[data-v-3a881d7b]{float:left;padding:0 3rem;margin:.75rem 0;border-right:1px solid #c1ccda}.l-list-shengyi ._item[data-v-3a881d7b]:last-child{border-right:none}.l-list-shengyi ._num[data-v-3a881d7b]{font-size:1.5rem;color:#21a0ff;margin:.75rem 0}.l-list-shengyi ._old[data-v-3a881d7b]{color:#ccc}.l-list-shengyi ._old i[data-v-3a881d7b]{margin-left:10px;color:#ff4949}',"",{version:3,sources:["C:/Users/leo/Desktop/my jobs/web-apps/src/xifengniao/admin/pages/index.vue"],names:[],mappings:"AACA,wCAEE,SAAU,AACV,UAAW,AACX,eAAiB,CAClB,AACD,gCACE,iEAAkE,AAClE,yBAA2B,CAC5B,AACD,iCACE,YAAc,CACf,AACD,gCACE,gBAAiB,AACjB,iBAAmB,CACpB,AACD,uCACE,WAAY,AACZ,kBAAmB,AACnB,oBAAuB,AACvB,eAAiB,CAClB,AACD,yCACE,0BAA2B,AAC3B,kBAAmB,AACnB,kBAAmB,AACnB,yBAA8B,AAC9B,YAAa,AACb,aAAc,AACd,mBAAoB,AACpB,gBAAkB,AAClB,oBAAqB,AACrB,qBAAsB,AACtB,oBAAqB,AACrB,aAAc,AACd,yBAA0B,AACd,sBAAuB,AAC3B,mBAAoB,AAC5B,wBAAyB,AACb,qBAAsB,AAC1B,sBAAwB,CACjC,AACD,+FAEE,WAAY,AACZ,6BAA8B,AAC9B,WAAY,AACZ,kBAAmB,AACnB,OAAS,CACV,AACD,gDACE,UAAY,CACb,AACD,+CACE,WAAa,CACd,AACD,sCACE,eAAgB,AAChB,cAAe,AACf,iBAAkB,AAClB,eAAiB,CAClB,AACD,oIAEE,iBAAmB,CACpB,AACD,iCACE,eAAiB,CAClB,AACD,wCACE,WAAY,AACZ,eAAgB,AAChB,gBAAkB,AAClB,8BAAgC,CACjC,AACD,mDACE,iBAAmB,CACpB,AACD,uCACE,iBAAkB,AAClB,cAAe,AACf,eAAkB,CACnB,AACD,uCACE,UAAY,CACb,AACD,yCACE,iBAAkB,AAClB,aAAe,CAChB",file:"index.vue",sourcesContent:["\nul[data-v-3a881d7b],\nli[data-v-3a881d7b] {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.l-index-store[data-v-3a881d7b] {\n  background: url('/static/20171108102839.jpg') no-repeat right 50%;\n  background-size: 100% 100%;\n}\n.l-list-text li[data-v-3a881d7b] {\n  margin: 3px 0;\n}\n.l-circle-step[data-v-3a881d7b] {\n  overflow: hidden;\n  text-align: center;\n}\n.l-circle-step ._item[data-v-3a881d7b] {\n  float: left;\n  text-align: center;\n  margin: 0.75rem 0.5rem;\n  min-width: 178px;\n}\n.l-circle-step ._circle[data-v-3a881d7b] {\n  border: 10px solid #eff2f7;\n  border-radius: 50%;\n  position: relative;\n  color: rgba(71, 86, 105, 0.8);\n  width: 100px;\n  height: 100px;\n  margin: 0 auto 10px;\n  font-size: 0.6rem;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: center;\n              -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n              -ms-flex-pack: center;\n          justify-content: center;\n}\n.l-circle-step ._circle[data-v-3a881d7b]::before,\n.l-circle-step ._circle[data-v-3a881d7b]::after {\n  content: '';\n  border-top: 1px solid #eff2f7;\n  width: 100%;\n  position: absolute;\n  top: 50%;\n}\n.l-circle-step ._circle[data-v-3a881d7b]::before {\n  left: -100%;\n}\n.l-circle-step ._circle[data-v-3a881d7b]::after {\n  right: -100%;\n}\n.l-circle-step ._num[data-v-3a881d7b] {\n  font-size: 1rem;\n  color: #21a0ff;\n  margin-right: 2px;\n  font-weight: 600;\n}\n.l-circle-step ._item:first-child ._circle[data-v-3a881d7b]::before,\n.l-circle-step ._item:last-child ._circle[data-v-3a881d7b]::after {\n  visibility: hidden;\n}\n.l-list-shengyi[data-v-3a881d7b] {\n  overflow: hidden;\n}\n.l-list-shengyi ._item[data-v-3a881d7b] {\n  float: left;\n  padding: 0 3rem;\n  margin: 0.75rem 0;\n  border-right: 1px solid #c1ccda;\n}\n.l-list-shengyi ._item[data-v-3a881d7b]:last-child {\n  border-right: none;\n}\n.l-list-shengyi ._num[data-v-3a881d7b] {\n  font-size: 1.5rem;\n  color: #21a0ff;\n  margin: 0.75rem 0;\n}\n.l-list-shengyi ._old[data-v-3a881d7b] {\n  color: #ccc;\n}\n.l-list-shengyi ._old i[data-v-3a881d7b] {\n  margin-left: 10px;\n  color: #ff4949;\n}\n"],sourceRoot:""}])},660:function(t,e,a){var i=a(650);"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);a(582)("501b7727",i,!0)},666:function(t,e,a){!function(e,a){t.exports=a()}(0,function(){return function(t){function e(i){if(a[i])return a[i].exports;var n=a[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,e),n.l=!0,n.exports}var a={};return e.m=t,e.c=a,e.i=function(t){return t},e.d=function(t,a,i){e.o(t,a)||Object.defineProperty(t,a,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var a=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(a,"a",a),a},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/dist/",e(e.s=2)}([function(t,e,a){var i=a(4)(a(1),a(5),null,null);t.exports=i.exports},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a(3);e.default={props:{startVal:{type:Number,required:!1,default:0},endVal:{type:Number,required:!1,default:2017},duration:{type:Number,required:!1,default:3e3},autoplay:{type:Boolean,required:!1,default:!0},decimals:{type:Number,required:!1,default:0,validator:function(t){return t>=0}},decimal:{type:String,required:!1,default:"."},separator:{type:String,required:!1,default:","},prefix:{type:String,required:!1,default:""},suffix:{type:String,required:!1,default:""},useEasing:{type:Boolean,required:!1,default:!0},easingFn:{type:Function,default:function(t,e,a,i){return a*(1-Math.pow(2,-10*t/i))*1024/1023+e}}},data:function(){return{localStartVal:this.startVal,displayValue:this.formatNumber(this.startVal),printVal:null,paused:!1,localDuration:this.duration,startTime:null,timestamp:null,remaining:null,rAF:null}},computed:{countDown:function(){return this.startVal>this.endVal}},watch:{startVal:function(){this.autoplay&&this.start()},endVal:function(){this.autoplay&&this.start()}},mounted:function(){this.autoplay&&this.start(),this.$emit("mountedCallback")},methods:{start:function(){this.localStartVal=this.startVal,this.startTime=null,this.localDuration=this.duration,this.paused=!1,this.rAF=(0,i.requestAnimationFrame)(this.count)},pauseResume:function(){this.paused?(this.resume(),this.paused=!1):(this.pause(),this.paused=!0)},pause:function(){(0,i.cancelAnimationFrame)(this.rAF)},resume:function(){this.startTime=null,this.localDuration=+this.remaining,this.localStartVal=+this.printVal,(0,i.requestAnimationFrame)(this.count)},reset:function(){this.startTime=null,(0,i.cancelAnimationFrame)(this.rAF),this.displayValue=this.formatNumber(this.startVal)},count:function(t){this.startTime||(this.startTime=t),this.timestamp=t;var e=t-this.startTime;this.remaining=this.localDuration-e,this.useEasing?this.countDown?this.printVal=this.localStartVal-this.easingFn(e,0,this.localStartVal-this.endVal,this.localDuration):this.printVal=this.easingFn(e,this.localStartVal,this.endVal-this.localStartVal,this.localDuration):this.countDown?this.printVal=this.localStartVal-(this.localStartVal-this.endVal)*(e/this.localDuration):this.printVal=this.localStartVal+(this.localStartVal-this.startVal)*(e/this.localDuration),this.countDown?this.printVal=this.printVal<this.endVal?this.endVal:this.printVal:this.printVal=this.printVal>this.endVal?this.endVal:this.printVal,this.displayValue=this.formatNumber(this.printVal),e<this.localDuration?this.rAF=(0,i.requestAnimationFrame)(this.count):this.$emit("callback")},isNumber:function(t){return!isNaN(parseFloat(t))},formatNumber:function(t){t=t.toFixed(this.decimals),t+="";var e=t.split("."),a=e[0],i=e.length>1?this.decimal+e[1]:"",n=/(\d+)(\d{3})/;if(this.separator&&!this.isNumber(this.separator))for(;n.test(a);)a=a.replace(n,"$1"+this.separator+"$2");return this.prefix+a+i+this.suffix}},destroyed:function(){(0,i.cancelAnimationFrame)(this.rAF)}}},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a(0),n=function(t){return t&&t.__esModule?t:{default:t}}(i);e.default=n.default,"undefined"!=typeof window&&window.Vue&&window.Vue.component("count-to",n.default)},function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=0,n="webkit moz ms o".split(" "),r=void 0,s=void 0;if("undefined"==typeof window)e.requestAnimationFrame=r=function(){},e.cancelAnimationFrame=s=function(){};else{e.requestAnimationFrame=r=window.requestAnimationFrame,e.cancelAnimationFrame=s=window.cancelAnimationFrame;for(var l=void 0,o=0;o<n.length&&(!r||!s);o++)l=n[o],e.requestAnimationFrame=r=r||window[l+"RequestAnimationFrame"],e.cancelAnimationFrame=s=s||window[l+"CancelAnimationFrame"]||window[l+"CancelRequestAnimationFrame"];r&&s||(e.requestAnimationFrame=r=function(t){var e=(new Date).getTime(),a=Math.max(0,16-(e-i)),n=window.setTimeout(function(){t(e+a)},a);return i=e+a,n},e.cancelAnimationFrame=s=function(t){window.clearTimeout(t)})}e.requestAnimationFrame=r,e.cancelAnimationFrame=s},function(t,e){t.exports=function(t,e,a,i){var n,r=t=t||{},s=typeof t.default;"object"!==s&&"function"!==s||(n=t,r=t.default);var l="function"==typeof r?r.options:r;if(e&&(l.render=e.render,l.staticRenderFns=e.staticRenderFns),a&&(l._scopeId=a),i){var o=Object.create(l.computed||null);Object.keys(i).forEach(function(t){var e=i[t];o[t]=function(){return e}}),l.computed=o}return{esModule:n,exports:r,options:l}}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;return(t._self._c||e)("span",[t._v("\n  "+t._s(t.displayValue)+"\n")])},staticRenderFns:[]}}])})},699:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"l-main-body"},[a("el-row",{attrs:{gutter:20}},[a("el-col",{attrs:{span:16}},[a("el-card",{staticClass:"l-index-store",staticStyle:{height:"190px"}},[a("div",{staticClass:"l-flex-h"},[a("img",{staticClass:"l-margin-r",attrs:{width:"150",height:"150",src:t.organization.imageArr[0]}}),t._v(" "),a("div",{staticClass:"l-rest"},[a("h3",[t._v(t._s(t.organization.shortName))]),t._v(" "),a("p",{staticClass:"l-margin-tb-m l-text-gray"},[t._v(t._s(t.$$config.baseData.orgLevel[t.organization.orgLevel-1]))]),t._v(" "),a("p",{staticClass:"l-margin-tb-m l-text-gray"},[t._v(t._s(t.organization.address))]),t._v(" "),a("p",[a("router-link",{staticClass:"l-text-link",attrs:{to:"/base/setting?tab=zuzhi"}},[t._v("更改基础设置")])],1)])])])],1),t._v(" "),a("el-col",{attrs:{span:8}},[a("el-card",{staticStyle:{height:"190px"}},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("b",[t._v("公告/通知")])]),t._v(" "),a("ul",{staticClass:"l-list-text"})])],1)],1),t._v(" "),a("el-row",{staticClass:"l-margin-t"},[a("el-col",{attrs:{span:24}},[a("el-card",[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("b",[t._v("客户管理")]),t._v(" "),a("router-link",{staticClass:"l-fr l-text-link",attrs:{to:"/customer?tab=track"}},[t._v("查看全部")])],1),t._v(" "),a("ul",{staticClass:"l-circle-step"},[a("li",{staticClass:"_item"},[a("p",{staticClass:"_circle"},[a("b",[t._v("落定")])]),t._v(" "),a("p",[a("b",{staticClass:"_num"},[t._v(t._s(t.customerOrder.one))]),t._v("个客户落定")]),t._v(" "),a("p",[a("router-link",{staticClass:"l-text-link",attrs:{to:"/customer?tab=track"}},[t._v("查看")])],1)]),t._v(" "),a("li",{staticClass:"_item"},[a("p",{staticClass:"_circle"},[a("b",[t._v("车辆出库")])]),t._v(" "),a("p",[a("b",{staticClass:"_num"},[t._v(t._s(t.customerOrder.two))]),t._v("个客户车辆已出库")]),t._v(" "),a("p",[a("router-link",{staticClass:"l-text-link",attrs:{to:"/customer?tab=track"}},[t._v("查看")])],1)]),t._v(" "),a("li",{staticClass:"_item"},[a("p",{staticClass:"_circle"},[a("b",[t._v("完款")])]),t._v(" "),a("p",[a("b",{staticClass:"_num"},[t._v(t._s(t.customerOrder.three))]),t._v("个客户已完款")]),t._v(" "),a("p",[a("router-link",{staticClass:"l-text-link",attrs:{to:"/customer?tab=track"}},[t._v("查看")])],1)]),t._v(" "),a("li",{staticClass:"_item"},[a("p",{staticClass:"_circle"},[a("b",[t._v("加装/上牌")])]),t._v(" "),a("p",[a("b",{staticClass:"_num"},[t._v(t._s(t.customerOrder.four))]),t._v("台车正在加装/上牌")]),t._v(" "),a("p",[a("router-link",{staticClass:"l-text-link",attrs:{to:"/customer?tab=track"}},[t._v("查看")])],1)]),t._v(" "),a("li",{staticClass:"_item"},[a("p",{staticClass:"_circle"},[a("b",[t._v("交车")])]),t._v(" "),a("p",[a("b",{staticClass:"_num"},[t._v(t._s(t.customerOrder.five))]),t._v("个客户可以交车")]),t._v(" "),a("p",[a("router-link",{staticClass:"l-text-link",attrs:{to:"/customer?tab=track"}},[t._v("查看")])],1)])])])],1)],1),t._v(" "),a("el-row",{staticClass:"l-margin-t"},[a("el-col",{attrs:{span:24}},[a("el-card",[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("b",[t._v("订购车辆")]),t._v(" "),a("router-link",{staticClass:"l-fr l-text-link",attrs:{to:"/stock?tab=order"}},[t._v("查看全部")])],1),t._v(" "),a("ul",{staticClass:"l-circle-step"},[a("li",{staticClass:"_item"},[a("p",{staticClass:"_circle"},[a("b",[t._v("待处理")])]),t._v(" "),a("p",[a("b",{staticClass:"_num"},[t._v(t._s(t.stockOrder.pending))]),t._v("个订单待处理")]),t._v(" "),a("p",[a("router-link",{staticClass:"l-text-link",attrs:{to:"/stock?tab=order"}},[t._v("查看")])],1)]),t._v(" "),a("li",{staticClass:"_item"},[a("p",{staticClass:"_circle"},[a("b",[t._v("待付尾款")])]),t._v(" "),a("p",[a("b",{staticClass:"_num"},[t._v(t._s(t.stockOrder.waitFor))]),t._v("个订单已处理，待付尾款")]),t._v(" "),a("p",[a("router-link",{staticClass:"l-text-link",attrs:{to:"/stock?tab=order"}},[t._v("查看")])],1)]),t._v(" "),a("li",{staticClass:"_item"},[a("p",{staticClass:"_circle"},[a("b",[t._v("待签收入库")])]),t._v(" "),a("p",[a("b",{staticClass:"_num"},[t._v(t._s(t.stockOrder.waitingForStorage))]),t._v("个订单已出库，待签收")]),t._v(" "),a("p",[a("router-link",{staticClass:"l-text-link",attrs:{to:"/stock?tab=order"}},[t._v("查看")])],1)])])])],1)],1)],1)},staticRenderFns:[]}}});