<template>
  <el-dialog class="amap-dialog" :close-on-click-modal="false" :close-on-press-escape="false" :visible="show" :before-close="closeMap" title="请选择地址">
    <div class="amap-container">
      <div class="amap-address">
        <el-form size="small" label-position="left" label-width="40px">
          <el-form-item label="省份">
            <el-input v-model="options.province" readonly></el-input>
          </el-form-item>
          <el-form-item label="城市">
            <el-input v-model="options.city" readonly></el-input>
          </el-form-item>
          <el-form-item label="地区">
            <el-input v-model="options.area" readonly></el-input>
          </el-form-item>
          <el-form-item label="经度">
            <el-input v-model="options.longitude" readonly></el-input>
          </el-form-item>
          <el-form-item label="纬度">
            <el-input v-model="options.latitude" readonly></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <div class="l-flex-h">
              <div class="l-margin-r-s l-rest">
                <el-input autosize type="textarea" v-model="options.address"></el-input>  
              </div>
              <el-tooltip content="如地址定位不准确，可自行修改" placement="right" effect="light">
                <i class="el-icon-question" style="margin-top:10px;"></i>
              </el-tooltip>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button @click="closeMap()">取消</el-button>
            <el-button style="width: 120px;" type="primary" @click="selected()">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="amap-view">
        <el-amap-search-box class="amap-search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap vid="amapSeletor" :center="mapCenter" :zoom="15" :plugin="plugin">
          <el-amap-marker title="拖动此选择地点" :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable"></el-amap-marker>
        </el-amap>  
      </div>
    </div>
  </el-dialog>
</template>

<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: {
        province: '',
        provinceId: '',
        city: '',
        cityId: '',
        area: '',
        areaId: '',
        address: '',
        longitude: 113.289201,
        latitude: 23.081646,
        onSelected: function () {}
      }
    }
  },
  data() {
    let that = this
    return {
      show: false,
      mapCenter: [113.289201, 23.081646],
      marker: {
        icon: 'http://webapi.amap.com/theme/v1.3/markers/b/mark_r.png',
        position: [113.289201, 23.081646],
        events: {
          dragend: (e) => {
            that.getAddress(e.lnglat.lng, e.lnglat.lat)
          }
        },
        visible: true,
        draggable: true
      },
      searchOption: {
        city: '',
        citylimit: false
      },
      plugin: [{
        pName: 'Geocoder',
        events: {
          init(instance) {
            that.geocoder = instance
          }
        }
      }]
    }
  },
  watch: {
    visible(val) {
      this.show = val
      if(val) {
        // 显示当前地址
        setTimeout(() => {
          if(this.options.longitude && this.options.latitude){
            this.mapCenter = [this.options.longitude, this.options.latitude]
            this.marker.position = [this.options.longitude, this.options.latitude]
            this.getAddress(this.options.longitude, this.options.latitude)    
          }
        }, 300)
      }
    },
    show(val) {
      this.$emit('update:visible', val)
    }
  },
  //相关操作事件
  methods: {
    closeMap() {
      this.show = false
    },
    getAddress(lng, lat) {
      return new Promise((resolve, reject) => {
        this.geocoder.getAddress([lng, lat], (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            console.log(result)
            let addressComponent = result.regeocode.addressComponent
            let address = result.regeocode.formattedAddress.split(addressComponent.district)[1] || (addressComponent.street + addressComponent.streetNumber)

            this.options.province = addressComponent.province
            this.options.city = addressComponent.city || addressComponent.province
            this.options.area = addressComponent.district
            this.options.address = address
            this.options.longitude = lng
            this.options.latitude = lat
            
            resolve(result)
          } else{
            reject(result)
          }
        })
      })
    },
    onSearchResult(pois) {
      const that = this
      if (pois.length > 0) {
        let poi = pois[0]
        let poiArr = [poi.lng, poi.lat]

        that.mapCenter = poiArr
        that.marker.position = poiArr
        that.getAddress(poi.lng, poi.lat)
      }else{
        that.$message({
          type: 'error',
          message: '没有搜索到相关结果'
        })
      }
    },
    selected() {
      this.options.onSelected(this.options)
      this.closeMap()
    }
  }
}
</script>

<style lang="less">
.amap-dialog .el-dialog__body{padding: 0;}
.amap-container {display: flex; position: relative; height: 100%; }
.amap-container .amap-address{padding: 20px 20px 0; background: rgb(239, 239, 244);}
.amap-container .amap-view{flex:1; position: relative;}
.amap-search-box {position: absolute !important; top: 15px; left: 15px; z-index: 999; background: rgba(255, 255, 255, 1)!important;}
.amap-search-box .search-tips{ max-height: 300px; min-width: 358px;}
.amap-search-box .search-btn{ background: #efeff4 !important; min-width: 70px; text-align: center;}
.amap-search-box .search-btn:active{background: #3a8ee6 !important;}
.amap-search-box .search-box-wrapper input{background: transparent;}
</style>
