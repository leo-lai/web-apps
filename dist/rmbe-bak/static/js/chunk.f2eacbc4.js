webpackJsonp([9],{669:function(t,e,i){var l=i(10)(i(757),i(840),null,null);t.exports=l.exports},757:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"materiel",data:function(){return{list:{filter:{tel:"",numnber:"",related:""},rules:{tel:[],numnber:[],related:[]},loading:!1,page:1,row:100,total:0,data:[]}}},methods:{sizeChange:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:100;this.getList(1,t)},pageChange:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this.getList(t)},getList:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1,i=arguments[1];this.list.loading=!0,this.$$api.device.getRemindList(this.list.filter,e,i).then(function(e){var i=e.data;t.list.total=i.count,t.list.page=Number(i.page_number)+1,t.list.row=Number(i.per_page),t.list.data=i.list.map(function(t){return t.address=(t.province||"")+(t.city||"")+(t.district||"")+(t.detail_address||""),t.doing=!1,t})}).finally(function(e){t.list.loading=!1})},refreshList:function(){this.getList(this.list.page)},search:function(){this.getList()},clear:function(){this.$refs.listFilter&&this.$refs.listFilter.resetFields(),this.getList()},supply:function(t){var e=this;t.doing=!0,this.$$api.device.supply(t.number).then(function(t){e.$message.success("补货成功"),e.refreshList()}).finally(function(e){t.doing=!1})}},mounted:function(){this.getList()}}},840:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"l-main-body"},[i("el-row",[i("el-col",{staticClass:"l-text-right",attrs:{span:24}},[i("el-form",{ref:"listFilter",attrs:{inline:"",model:t.list.filter,rules:t.list.rules},nativeOn:{submit:function(t){t.preventDefault()}}},[i("el-form-item",{attrs:{prop:"number",lalel:""}},[i("el-input",{attrs:{placeholder:"设备编号"},model:{value:t.list.filter.number,callback:function(e){t.$set(t.list.filter,"number",e)},expression:"list.filter.number"}})],1),t._v(" "),i("el-form-item",[i("el-button",{attrs:{type:"primary"},on:{click:t.search}},[t._v("查询")]),t._v(" "),i("el-button",{on:{click:t.clear}},[t._v("刷新")])],1)],1)],1)],1),t._v(" "),i("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.list.loading,expression:"list.loading"}],staticClass:"l-table-hdbg",attrs:{stripe:"","element-loading-spinner":"el-icon-loading","element-loading-text":"拼命加载中",data:t.list.data}},[i("el-table-column",{attrs:{label:"设备编号",prop:"number","min-width":"150"}}),t._v(" "),i("el-table-column",{attrs:{label:"商家手机号",prop:"tel","min-width":"150"}}),t._v(" "),i("el-table-column",{attrs:{label:"店铺名称",prop:"store_name","min-width":"150"}}),t._v(" "),i("el-table-column",{attrs:{label:"店铺地址",prop:"address","min-width":"200"}}),t._v(" "),i("el-table-column",{attrs:{label:"剩余使用次数",prop:"remain_count",align:"center","min-width":"150"}}),t._v(" "),i("el-table-column",{attrs:{label:"操作",align:"center","min-width":"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[i("span",{directives:[{name:"show",rawName:"v-show",value:e.row.doing,expression:"scope.row.doing"}],staticClass:"l-text-warn"},[i("i",{staticClass:"el-icon-loading"}),t._v(" 操作中")]),t._v(" "),i("span",{directives:[{name:"show",rawName:"v-show",value:!e.row.doing,expression:"!scope.row.doing"}]},[i("el-button",{attrs:{type:"primary",size:"small"},on:{click:function(i){t.supply(e.row)}}},[t._v("确认补货")])],1)]}}])})],1),t._v(" "),i("el-row",{staticClass:"l-text-center l-margin-t"},[i("el-pagination",{attrs:{layout:"total, sizes, prev, pager, next, jumper","page-sizes":t.$$api.pageSizes,"page-size":t.list.row,"current-page":t.list.page,total:t.list.total},on:{"size-change":t.sizeChange,"current-change":t.pageChange}})],1)],1)},staticRenderFns:[]}}});