<template>
<div
  :style="{ width: width, height: height }"
  class="slider">
  <div>

  </div>

  <div v-if="list.length">
    <slot></slot>
  </div>
  <button @click="next">test</button>
</div>
</template>

<script>
import Animator from './animator'

export default {
  data () {
    return {
    }
  },

  props: {
    width: {
      type: String,
      default: 'auto'
    },
    height: {
      type: String,
      default: '300px'
    },
    interval: {
      type: Number,
      default: 3000
    },
    speed: {
      type: Number,
      default: 500
    },
    auto: {
      type: Boolean,
      default: true
    },
    indicators: {
      default: 'center'
    },
    controlBtn: {
      type: Boolean,
      default: true
    },
    animation: {
      type: String,
      default: 'normal'
    },
    list: {
      type: Array,
      default () { return [] }
    },
  },

  computed: {
  },

  methods: {
  },

  beforeMount () {
  },

  beforeDestroy () {
  },

  activated () {
  },

  deactivated () {
  },

  components: {
  }
}
</script>

<style lang="less" scoped>
.slider {
  overflow: hidden;
}
</style>
