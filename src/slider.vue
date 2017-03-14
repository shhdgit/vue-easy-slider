<template>
<div
  :style="{ width: width, height: height }"
  class="slider">
  <transition-group
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
    :css="false"
    tag="p"
    class="test">
    <span v-for="item in children" :key="item">
      <slot></slot>
    </span>
  </transition-group>
  <div style="display: none;">
  </div>
  <button @click="next">test</button>
</div>
</template>

<script>
import Animator from './animator'

const animation = {
  normal_std: {
    beforeEnter (vm, el) {
      const dom = vm.$el
      const styles = getComputedStyle(dom)
      const width = styles.width
      el.style.transform = `translateX(${ width })`
    },
    async enter (vm, el) {
      const dom = vm.$el
      const styles = getComputedStyle(dom)
      const width = parseInt(styles.width)
      const animator = new Animator(vm.thisSpeed, function (p) {
        el.style.transform = `translateX(${ width * (1 - p) }px)`
      })
      await animator.animate()
    },
    async leave (vm, el) {
      const dom = vm.$el
      const styles = getComputedStyle(dom)
      const width = parseInt(styles.width)
      const animator = new Animator(vm.thisSpeed, function (p) {
        el.style.transform = `translateX(${ -width * p }px)`
      })
      await animator.animate()
    },
  },
  fade_std: {
    beforeEnter (vm, el) {
      el.style.opacity = 0
    },
    async enter (vm, el) {
      const animator = new Animator(vm.thisSpeed, function (p) {
        el.style.opacity = p
      })
      await animator.animate()
    },
    async leave (vm, el) {
      const animator = new Animator(vm.thisSpeed, function (p) {
        el.style.opacity = 1 - p
      })
      await animator.animate()
    },
  },
}

export default {
  data () {
    return {
      i: 0,
      timerId: 0,
      animationAddtion: 'std',
      minSpeed: 300,
      children: [],
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
    }
  },

  computed: {
    thisAnimation: {
      get () {
        return `${ this.animation }_${ this.animationAddtion }`
      },
      set (val) {
        this.animationAddtion = val
      },
    },
    thisSpeed () {
      const speed = this.speed
      const minSpeed = this.minSpeed
      return speed > minSpeed ? speed : minSpeed
    },
    thisInterval () {
      const interval = this.interval
      const speed = this.thisSpeed
      return interval > speed ? interval : speed
    },
  },

  methods: {
    init () {
      if (this.auto) this.autoplay()
    },
    destroy () {
      if (this.auto) this.stopAutoplay()
    },
    newItem () {
    },
    beforeEnter (el) {
      animation[this.thisAnimation].beforeEnter(this, el)
    },
    async enter (el, done) {
      await animation[this.thisAnimation].enter(this, el)
      done()
    },
    async leave (el, done) {
      await animation[this.thisAnimation].leave(this, el)
      done()
    },
    autoplay () {
      const interval = this.thisInterval
      const self = this
      function step () {
        self.thisAnimation = 'std'
        self.change((self.i + 1) % 10)
        self.timerId = setTimeout(step, interval)
      }
      this.timerId = setTimeout(step, interval)
    },
    stopAutoplay () {
      clearTimeout(this.timerId)
    },
    change (i) {
      // this.i = i
      const h = this.$createElement
    },
    next () {
      this.stopAutoplay()
      this.change((this.i + 1) % 10)
      this.autoplay()
    },
    prev () {
      this.stopAutoplay()
      this.change((this.i - 1) % 10)
      this.autoplay()
    },
  },

  beforeMount () {
  },

  mounted () {
    console.log(this.$slots.default[0].child)
    this.children.push(this.$slots.default[0].child)
    // const slideItem = this.$slots.default[0].child
    // slideItem.$set(slideItem.$data.test, 'id', 0)
    // const slideItem2 = this.$slots.default[1].child
    // slideItem2.$set(slideItem2.$data.test, 'id', 1)
    // console.log(slideItem.$data)
    // this.init()
  },

  beforeDestroy () {
    this.destroy()
  },

  activated () {
    this.init()
  },

  deactivated () {
    this.destroy()
  },

  components: {
  }
}
</script>

<style lang="less" scoped>
.slider {
  overflow: hidden;
}
.test {
  width: 100%;
  height: 100%;
  span {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}
</style>
