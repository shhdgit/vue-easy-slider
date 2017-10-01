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

// snovakovic@https://github.com/shhdgit/vue-easy-slider/pull/19
const parseWidth = function (el) {
  const styles = getComputedStyle(el)
  const widthText = styles.width
  return parseFloat(widthText)
}

const negateIf = (val, condition) => condition ? -val : val;

const animate = function (speed, rule, callback) {
  const animation = new Animator(speed, rule)
  animation.animate(callback)
}

const animation = {
  normal: {
    beforeEnter (vm, el) {
      let width = negateIf(parseWidth(el), !vm.direction)
      el.style.transform = `translateX(${width}px)`
    },
    enter (vm, el, callback) {
      const width = negateIf(parseWidth(el), !vm.direction)
      animate(vm.speed, (p) => {
        el.style.transform = `translateX(${ width - width * p }px)`
      }, callback)
    },
    leave (vm, el, callback) {
      const width = negateIf(parseWidth(el), vm.direction)
      animate(vm.speed, (p) => {
        el.style.transform = `translateX(${ width * p }px)`
      }, callback)
    },
  },
  fade: {
    beforeEnter (vm, el) {
      el.style.opacity = 0
      el.style.transform = `translateX(${vm.direction ? '10px' : '-10px'})`
    },
    enter (vm, el, callback) {
      const translate = vm.direction ? 10 : -10
      animate(vm.speed, (p) => {
        el.style.opacity = p
        el.style.transform = `translateX(${ translate - translate * p }px)`
      }, callback)
    },
    leave (vm, el, callback) {
      const translate = vm.direction ? -10 : 10
      animate(vm.speed, (p) => {
        el.style.opacity = 1 - p
        el.style.transform = `translateX(${ translate * p }px)`
      }, callback)
    },
  },
}

export default {
  name: 'easy-slider-item',

  data () {
    return {
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
    beforeEnter (el) {
      animation[this.animation].beforeEnter(this, el)
    },
    enter (el, done) {
      animation[this.animation].enter(this, el, done)
    },
    leave (el, done) {
      animation[this.animation].leave(this, el, () => {
        done()
        this.show = false
      })
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
.slider-item,
.wrap {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
}
</style>
