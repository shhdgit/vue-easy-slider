<template>
  <div class="slider-item" v-if="show" @click="onClick">
    <transition :css="false" @beforeEnter="beforeEnter" @enter="enter" @leave="leave">
      <div class="wrap" v-if="animate">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
  import Animator from '../animator'

  const animation = {
    normal: {
      beforeEnter (vm, el) {
        const styles = getComputedStyle(el)
        const widthText = styles.width
        const width = parseFloat(widthText)
        el.style.transform = 'translateX(' + (vm.direction ? widthText : `-${widthText}`) + ')'
      },
      enter (vm, el, callback) {
        const styles = getComputedStyle(el)
        const widthText = styles.width
        const width = vm.direction ? parseFloat(widthText) : -parseFloat(widthText)
        const animation = new Animator(vm.speed, function (p) {
          el.style.transform = `translateX(${width - width * p}px)`
        })
        animation.animate(() => callback())
      },
      leave (vm, el, callback) {
        const styles = getComputedStyle(el)
        const widthText = styles.width
        const width = vm.direction ? -parseFloat(widthText) : parseFloat(widthText)
        const animation = new Animator(vm.speed, function (p) {
          el.style.transform = `translateX(${width * p}px)`
        })
        animation.animate(() => callback())
      },
    },
    fade: {
      beforeEnter (vm, el) {
        el.style.opacity = 0
        el.style.transform = vm.direction ? 'translateX(10px)' : 'translateX(-10px)'
      },
      enter (vm, el, callback) {
        const translate = vm.direction ? 10 : -10
        const animation = new Animator(vm.speed, function (p) {
          el.style.opacity = p
          el.style.transform = `translateX(${translate - translate * p}px)`
        })
        animation.animate(() => callback())
      },
      leave (vm, el, callback) {
        const translate = vm.direction ? -10 : 10
        const animation = new Animator(vm.speed, function (p) {
          el.style.opacity = 1 - p
          el.style.transform = `translateX(${translate * p}px)`
        })
        animation.animate(() => callback())
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
        default () { },
      },
    },

    methods: {
      beforeEnter (el) {
        animation[this.animation].beforeEnter(this, el)
      },
      enter (el, done) {
        animation[this.animation].enter(this, el, () => done())
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
