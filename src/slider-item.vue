<template>
  <transition
    :name="initAnimation ? '' : `${animation}-${direction ? 'left' : 'right'}`"
  >
    <div
      v-show="display"
      v-bind="$attrs"
      :style="{ zIndex: zIndex, transition: `all ${speed / 1000}s` }"
      class="slider-item"
      v-on="$listeners"
    >
      <slot />
    </div>
  </transition>
</template>

<script>
export default {
  name: 'SliderItem',
  data() {
    return {
      display: false,
      isInit: false,
      initAnimation: false,
      direction: false,
      animation: 'normal',
      speed: 500,
      zIndex: 99,
    }
  },

  created() {
    this.$parent.$emit('slider:init')
    this.speed = this.$parent.speed || 500
    this.animation = this.$parent.animation || 'normal'
  },

  destroyed() {
    this.$parent.$emit('slider:init')
  },

  methods: {
    init() {
      if (this.isInit) {
        return
      }

      this.isInit = true
      this.display = true
      this.initAnimation = true
      this.$nextTick(() => (this.initAnimation = false))
    },
    // direction: left: true, right: false
    show(direction) {
      this.zIndex = 99
      this.direction = direction
      this.$nextTick(() => (this.display = true))
    },
    hide(direction) {
      this.zIndex = 98
      this.direction = direction
      this.$nextTick(() => (this.display = false))
    },
  },
}
</script>

<style lang="stylus" scoped>
.slider-item
  position absolute
  top 0
  left 0

  width 100%
  height 100%
.normal-right-enter,
.normal-left-leave-to
  transform translateX(-100%)
.normal-left-enter,
.normal-right-leave-to
  transform translateX(100%)
.fade-left-enter,
.fade-right-enter,
.fade-left-leave-to,
.fade-right-leave-to
  opacity 0
.fade-right-enter,
.fade-left-leave-to
  transform translateX(-10px)
.fade-left-enter,
.fade-right-leave-to
  transform translateX(10px)
</style>
