<template>
  <div class="l-viewer">
    <!-- 预览图片 -->
    <img v-for="{thumb, src} in images" :key="src" :src="thumb" :data-source="src" >
  </div>
</template>
<script>
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'
const defaults = {
  zIndex: 100000000,
  inline: false,
  button: true,
  navbar: true,
  title: false,
  toolbar: true,
  tooltip: false,
  movable: true,
  zoomable: true,
  rotatable: true,
  scalable: true,
  transition: true,
  fullscreen: true,
  keyboard: true,
  url: 'data-source'
}
export default {
  props: {
    images: {
      required: true,
      type: Array,
      default: []
    },
    options: {
      type: Object
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
    }
  },
  methods: {
    createViewer () {
      this.$viewer && this.$viewer.destroy() 
      if(this.images && this.images.length > 0) {
        const options = Object.assign({}, defaults, this.options)  
        this.$viewer = new Viewer(this.$el, options)
        this.$viewer.show2 = index => {
          this.$viewer.index = Number(index) >= 0 ? index : this.index 
          this.$viewer.show()
        }
        this.$parent.$$viewer = this.$viewer
      }
    },
  },
  watch: {
    images () {
      this.$nextTick(() => {
        this.createViewer()
      })
    },
    options: {
      handler: function () {
        this.$nextTick(() => {
          this.createViewer()
        })
      },
      deep: true
    }
  },
  mounted () {
    this.createViewer()
  },
  destroyed () {
    this.$viewer && this.$viewer.destroy()
  }
}
</script>
<style>
.l-viewer{position: fixed; top:0; left:0; width: 0; height: 0;  z-index: -1;}
.viewer-container{background-color: rgba(0, 0, 0, .9) !important}
.viewer-button{width: 90px !important; height: 90px !important; transform: scale(1.2);}
</style>