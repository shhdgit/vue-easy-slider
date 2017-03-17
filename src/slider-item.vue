<template>
<div class="slider-item" v-if="show" @click="onClick">
  <transition
    :css="false"
    @beforeEnter="beforeEnter"
    @enter="enter"
    @leave="leave">
    <div class="wrap" v-if="animate">
      <slot></slot>
    </div>
  </transition>
</div>
</template>

<script>
import Animator from './animator'

const animation = {
  normal: {
    beforeEnter (vm, el) {
      const styles = getComputedStyle(el)
      const widthText = styles.width
      const width = parseFloat(widthText)
      el.style.transform = 'translateX(' + (vm.direction ? widthText : `-${ widthText }`) + ')'
    },
    async enter (vm, el) {
      const styles = getComputedStyle(el)
      const widthText = styles.width
      const width = vm.direction ? parseFloat(widthText) : -parseFloat(widthText)
      const animation = new Animator(vm.speed, function (p) {
        el.style.transform = `translateX(${ width - width * p }px)`
      })
      await animation.animate()

      return Promise.resolve()
    },
    async leave (vm, el) {
      const styles = getComputedStyle(el)
      const widthText = styles.width
      const width = vm.direction ? -parseFloat(widthText) : parseFloat(widthText)
      const animation = new Animator(vm.speed, function (p) {
        el.style.transform = `translateX(${ width * p }px)`
      })
      await animation.animate()

      return Promise.resolve()
    },
  },
  fade: {
    beforeEnter (vm, el) {
      el.style.opacity = 0
      el.style.transform = vm.direction ? 'translateX(10px)' : 'translateX(-10px)'
    },
    async enter (vm, el) {
      const translate = vm.direction ? 10 : -10
      const animation = new Animator(vm.speed, function (p) {
        el.style.opacity = p
        el.style.transform = `translateX(${ translate - translate * p }px)`
      })
      await animation.animate()

      return Promise.resolve()
    },
    async leave (vm, el) {
      const translate = vm.direction ? -10 : 10
      const animation = new Animator(vm.speed, function (p) {
        el.style.opacity = 1 - p
        el.style.transform = `translateX(${ translate * p }px)`
      })
      await animation.animate()

      return Promise.resolve()
    },
  },
}

export default {
  name: 'easy-slider-item',

  data () {
    return {
      index: -1,
      animate: false,
      direction: 0,
      speed: 0,
      show: false,
      animation: '',
    }
  },

  props: {
    onClick: {
      type: Function,
      default () {},
    },
  },

  methods: {
    setIndex (i) {
      this.index = i
    },
    beforeEnter (el) {
      animation[this.animation].beforeEnter(this, el)
    },
    async enter (el, done) {
      await animation[this.animation].enter(this, el)
      done()
    },
    async leave (el, done) {
      await animation[this.animation].leave(this, el)
      done()
      this.show = false
    },
    showHandle (direction) {
      this.direction = direction
      this.show = true
      this.$nextTick(() => this.animate = true)
    },
    hideHandle (direction) {
      this.direction = direction
      this.animate = false
    },
    initItem () {
      this.animate = true
      this.show = true
    },
  },

  created () {
    this.$parent.handleItemChange()
    this.speed = this.$parent.speed
    this.animation = this.$parent.animation
  },
}
</script>

<style scoped>
.slider-item {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
}
.wrap {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
}
</style>
