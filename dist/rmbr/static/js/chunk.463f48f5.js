webpackJsonp([5],{638:function(e,o,t){t(755);var a=t(41)(t(710),t(765),"data-v-0ba7ee8b",null);e.exports=a.exports},710:function(e,o,t){"use strict";Object.defineProperty(o,"__esModule",{value:!0}),o.default={name:"login",data:function(){return{loginForm:{loading:!1,remember:!0,data:{username:"admin",password:"admin"},rules:{username:[{required:!0,message:"请输入账号",trigger:"blur"}],password:[{required:!0,message:"请输入密码",trigger:"blur"}]}}}},methods:{resetForm:function(){this.$refs.loginForm.resetFields()},submitForm:function(e){var o=this;this.$refs.loginForm.validate(function(e){e&&(o.loginForm.loading=!0,o.$store.dispatch("login",o.loginForm.data).then(function(e){o.$$href(o.$route.query.to||"/","replace")}).finally(function(){o.loginForm.loading=!1}))})}},mounted:function(){this.$$storage.local.remove("usermenus"),this.$$storage.local.remove("userinfo")}}},719:function(e,o,t){o=e.exports=t(629)(),o.push([e.i,".l-login-container[data-v-0ba7ee8b]{height:100%;background:#373d41;padding:.75rem}.l-login-form[data-v-0ba7ee8b]{border-radius:5px;background:hsla(0,0%,100%,.95);background-clip:padding-box;width:350px;padding:35px 35px 15px;border:1px solid #eaeaea;box-shadow:0 0 5px #cac6c6}.l-login-form ._tit[data-v-0ba7ee8b]{margin:0 auto 40px;text-align:center;color:#505458}.l-login-form ._remember[data-v-0ba7ee8b]{margin:0 0 35px}","",{version:3,sources:["C:/leo-work/web-apps/src/rmbr/admin/pages/login.vue"],names:[],mappings:"AACA,oCACE,YAAa,AACb,mBAAoB,AACpB,cAAiB,CAClB,AACD,+BACE,kBAAmB,AACnB,+BAAsC,AACtC,4BAA6B,AAC7B,YAAa,AACb,uBAA6B,AAC7B,yBAA0B,AAC1B,0BAA4B,CAC7B,AACD,qCACE,mBAA2B,AAC3B,kBAAmB,AACnB,aAAe,CAChB,AACD,0CACE,eAAyB,CAC1B",file:"login.vue",sourcesContent:["\n.l-login-container[data-v-0ba7ee8b] {\n  height: 100%;\n  background: #373d41;\n  padding: 0.75rem;\n}\n.l-login-form[data-v-0ba7ee8b] {\n  border-radius: 5px;\n  background: rgba(255, 255, 255, 0.95);\n  background-clip: padding-box;\n  width: 350px;\n  padding: 35px 35px 15px 35px;\n  border: 1px solid #eaeaea;\n  box-shadow: 0 0 5px #cac6c6;\n}\n.l-login-form ._tit[data-v-0ba7ee8b] {\n  margin: 0px auto 40px auto;\n  text-align: center;\n  color: #505458;\n}\n.l-login-form ._remember[data-v-0ba7ee8b] {\n  margin: 0px 0px 35px 0px;\n}\n"],sourceRoot:""}])},755:function(e,o,t){var a=t(719);"string"==typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);t(630)("dcf5f594",a,!0)},765:function(e,o){e.exports={render:function(){var e=this,o=e.$createElement,t=e._self._c||o;return t("div",{staticClass:"l-login-container l-flex-vhc"},[t("el-form",{ref:"loginForm",staticClass:"l-login-form",attrs:{"label-position":"left","label-width":"0px",model:e.loginForm.data,rules:e.loginForm.rules},nativeOn:{keyup:function(o){if(!("button"in o)&&e._k(o.keyCode,"enter",13,o.key))return null;e.submitForm(o)}}},[t("h3",{staticClass:"_tit"},[e._v("新疆瑞曼博尔管理系统")]),e._v(" "),t("el-form-item",{attrs:{prop:"username"}},[t("el-input",{attrs:{type:"text","auto-complete":"off",placeholder:"手机号码"},model:{value:e.loginForm.data.username,callback:function(o){e.$set(e.loginForm.data,"username","string"==typeof o?o.trim():o)},expression:"loginForm.data.username"}})],1),e._v(" "),t("el-form-item",{attrs:{prop:"password"}},[t("el-input",{attrs:{type:"password","auto-complete":"off",placeholder:"密码"},model:{value:e.loginForm.data.password,callback:function(o){e.$set(e.loginForm.data,"password","string"==typeof o?o.trim():o)},expression:"loginForm.data.password"}})],1),e._v(" "),t("el-form-item",{staticStyle:{width:"100%"}},[t("el-button",{staticStyle:{width:"100%","margin-top":"1rem"},attrs:{type:"primary",loading:e.loginForm.loading},nativeOn:{click:function(o){o.preventDefault(),e.submitForm(o)}}},[e._v("登录")])],1)],1),e._v(" "),t("div",{staticClass:"l-copy-right",staticStyle:{"margin-top":"1rem"}},[e._v("©2017-2018 新疆瑞曼博尔生物科技有限公司")])],1)},staticRenderFns:[]}}});