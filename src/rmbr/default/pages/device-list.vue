<template>
  <f7-page name="device-list">
    <f7-navbar title="设备列表" back-link="返回" sliding></f7-navbar>
    <!-- Search bar -->
    <!-- <f7-searchbar cancel-link="取消" search-list="#search-list" placeholder="输入设备别名/设备编号" :clear="true"
      @searchbar:search="onSearch"
      @searchbar:enable="onEnable"
      @searchbar:disable="onDisable"
      @searchbar:clear="onClear">
    </f7-searchbar> -->
  
    <!-- searchbar-not-found -->
    <!-- <f7-list class="searchbar-not-found">
      <f7-list-item title="Nothing found"></f7-list-item>
    </f7-list> -->

    <!-- Search-through list -->
    <f7-list class="searchbar-found" style="margin:0;" id="search-list" v-show="list.data.length > 0">
      <f7-list-item class="item-link" v-for="item in list.data" key="item" @click="openEdit(item)">
        <div slot="inner" class="l-flex-hc">
          <div class="l-rest">
            <div class="_tit">
              <p class="l-text-nowrap">编号：{{item.number}}</p>
              <p class="l-text-nowrap">别名：{{item.alias}}</p>
              <p class="l-text-nowrap">启动次数：{{item.start_count}}</p>
              <p class="l-text-nowrap">剩余次数：{{item.remain_count}}</p>
            </div>
          </div>
        </div>
      </f7-list-item>
    </f7-list>
    <infinite-loading :on-infinite="onInfinite" ref="infinite">
      <div class="l-loading-inline" slot="spinner"><f7-preloader></f7-preloader><span class="_txt">正在加载...</span></div>
      <div class="l-text-gray l-fs-m" slot="no-results">没有相关的数据</div>
      <div class="l-text-gray l-fs-m" slot="no-more">全部数据加载完毕</div>
    </infinite-loading>
    <!-- popup -->
    <f7-popup :opened="edit.opened">
      <f7-navbar>
        <f7-nav-left>
          <f7-link text="返回" icon-f7="chevron_left" @click="closeEdit"></f7-link>
        </f7-nav-left>
        <f7-nav-center>编辑设备</f7-nav-center>
        <f7-nav-right>
          <f7-link text="保存" icon-f7="check" @click="saveEdit"></f7-link>
        </f7-nav-right>
      </f7-navbar>

      <f7-list form>
        <f7-list-item>
          <f7-label>设备编号</f7-label>
          <f7-input disabled type="text" />
        </f7-list-item>
        <f7-list-item>
          <f7-label>设备编号</f7-label>
          <f7-input type="text" placeholder="请输入设备编号"/>
        </f7-list-item>
      </f7-list>
    </f7-popup>
  </f7-page>
</template>

<script>
import infiniteLoading from 'components/vue-infinite-loading'
export default {
  components: {
    infiniteLoading
  },
	data: function () {
    return {
      list: {
        page: 1,
        data: []
      },
      edit: {
        opened: false
      }
    }
  },
  methods: {
    onInfinite() {
      this.$$api.device.getList(this.page).then(data => {
        let returnList = data.list
        this.list.data = this.list.data.concat(returnList)

        if(returnList.length > 0){
          this.$nextTick(()=>{
            this.$refs.infinite.$emit('$InfiniteLoading:loaded')
          })
          
          if(returnList.length >= data.rows){
            this.list.page++
          }else{
            this.$refs.infinite.$emit('$InfiniteLoading:complete')
          }
        }else{
          this.$refs.infinite.$emit('$InfiniteLoading:complete')
        }
      }).catch(_ => {
        this.$refs.infinite.$emit('$InfiniteLoading:complete')
      })
    },
    onSearch: function (query, found) {
      console.log('search', query);
    },
    onClear: function (event) {
      console.log('clear');
    },
    onEnable: function (event) {
      console.log('enable');
    },
    onDisable: function (event) {
      console.log('disable');
    },
    openEdit(item) {
      this.edit.slted = item
      this.edit.opened = true
    },
    saveEdit() {
      this.closeEdit()
    },
    closeEdit() {
      this.edit.opened = false
    }
  },
  mounted() {
  }
}
</script>
<style lang="less">

</style>