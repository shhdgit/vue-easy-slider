<template>
  <transition :name="isInit ? '' : `${animation}-${direction ? 'left' : 'right'}`">
    <div
      v-if="display"
      v-bind="$attrs"
      :style="{ zIndex: zIndex, transition: `all ${speed / 1000}s` }"
      class="slider-item"
      v-on="$listeners"
    >
      <slot/>
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
      direction: false,
      animation: 'normal',
      speed: 500,
      zIndex: 99,
    }
  },

  created() {
    this.$parent.$emit('slider:init')
    this.speed = this.$parent.speed
    this.animation = this.$parent.animation
  },

  methods: {
    init() {
      this.isInit = true
      this.display = true
      this.$nextTick(() => (this.isInit = false))
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
