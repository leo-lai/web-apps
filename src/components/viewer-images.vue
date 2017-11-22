<template>
  <div class="l-viewer">
    <!-- 预览图片 -->
    <viewer ref="viewer" :options="$$config.viewer.options" :images="images" @inited="inited">
      <template slot-scope="scope">
        <img v-for="{thumb, src} in scope.images" :key="src" :src="thumb" :data-source="src" >
      </template>
    </viewer>
  </div>
</template>
<script>
import viewer from 'v-viewer/src/component.vue'
export default {
  components: {
    viewer
  },
  props: {
    images: {
      type: Array,
      default: []
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
    inited(viewer) {
      this.$parent.$$viewer = this.$$viewer = viewer
    }
  }
}
</script>
<style scoped lang="less">
.l-viewer{position: absolute; bottom: 0; height: 0; visibility: hidden;}
</style>
