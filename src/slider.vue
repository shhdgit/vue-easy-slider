<template>
  <div :style="{ width: width, height: height }" class="slider">
    <slot v-if="!sliderItems.length" name="loading">
      <div class="slider-loading">
        <div class="ball-pulse">
          <div/>
          <div/>
          <div/>
        </div>
      </div>
    </slot>
    <div ref="touchArea" class="slider-items">
      <slot/>
    </div>
    <div
      v-if="indicators"
      :class="`slider-indicators slider-indicators-${ indicators }`"
      @click.stop
    >
      <span
        v-for="i in sliderItems.length"
        :key="i"
        :class="{ 'slider-indicator-active': currentIndex === i - 1 }"
        class="slider-indicator-icon"
        @click="handleIndicator(i - currentIndex - 1)"
      />
    </div>
    <template v-if="controlBtn">
      <button class="slider-btn slider-btn-left" @click.stop="prev">
        <i class="slider-icon slider-icon-left"/>
      </button>
      <button class="slider-btn slider-btn-right" @click.stop="next">
        <i class="slider-icon slider-icon-right"/>
      </button>
    </template>
  </div>
</template>

<script>
import { throttle, debounce } from './utils'
import AlloyFinger from './alloyfinger'

export default {
  name: 'Slider',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: Number,
      default: 0,
    },
    width: {
      type: String,
      default: 'auto',
    },
    height: {
      type: String,
      default: '300px',
    },
    touch: {
      type: Boolean,
      default: true,
    },
    animation: {
      type: String,
      default: 'normal',
    },
    autoplay: {
      type: Boolean,
      default: true,
    },
    interval: {
      type: Number,
      default: 3000,
    },
    speed: {
      type: Number,
      default: 500,
    },
    indicators: {
      type: String,
      default: 'center',
    },
    controlBtn: {
      type: Boolean,
      default: true,
    },
    beforePrevious: {
      type: Function,
      default: () => true,
    },
    beforeNext: {
      type: Function,
      default: () => true,
    },
  },
  data() {
    return {
      sliderItems: [],
      currentIndex: 0,
      timer: 0,
      af: null,
    }
  },

  watch: {
    // FIXME: debounce
    value(current) {
      const step = current - this.currentIndex

      if (!step || current < 0 || current > this.sliderItems.length - 1) return

      this.handleIndicator(step)
    },
  },

  created() {
    this.init = throttle(this.init, 100)
    this.move = debounce(this.move, this.speed - 200)
    this.$on('slider:init', this.init)
  },
  mounted() {
    this.init()
    this.initTouchArea()
  },
  // init when keep-alive
  activated() {
    this.init()
    this.initTouchArea()
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
    this.af && this.af.destroy()
  },
  deactivated() {
    this.timer && clearInterval(this.timer)
    this.af && this.af.destroy()
  },

  methods: {
    init() {
      this.sliderItems = this.$children.filter(child => {
        return child.$options.name === 'SliderItem'
      })

      if (this.sliderItems[this.value]) {
        this.currentIndex = this.value
      }

      const currentItem = this.sliderItems[this.currentIndex]

      if (!currentItem) return

      currentItem.init()
      this.auto()
    },
    initTouchArea() {
      if (this.af || !this.touch) return

      const touchArea = this.$refs.touchArea

      this.af = new AlloyFinger(touchArea, {
        swipe: e => {
          e.direction === 'Left' ? this.next() : this.prev()
        },
      })
    },
    auto() {
      if (!this.autoplay || this.sliderItems.length < 2) return

      if (this.timer) clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.move(1)
      }, this.interval)
    },
    move(step) {
      if (!step) return

      // direction: left: true, right: false
      const direction = step > 0
      const nextIndex = this.getNextIndex(step)
      const currentItem = this.sliderItems[this.currentIndex]
      const nextItem = this.sliderItems[nextIndex]

      currentItem.hide(direction)
      nextItem.show(direction)
      this.currentIndex = nextIndex
      this.$emit('change', nextIndex)
    },
    prev() {
      if (!this.beforePrevious()) return

      this.handleControlBtn('previous')
    },
    next() {
      if (!this.beforePrevious()) return

      this.handleControlBtn('next')
    },
    handleIndicator(step) {
      if (this.sliderItems.length < 2 || !step) return

      this.move(step)
      this.auto()
    },
    /**
     * @param direction 'previous' | 'next'
     */
    handleControlBtn(direction) {
      if (this.sliderItems.length < 2) return

      const step = direction === 'next' ? 1 : -1
      const nextIndex = this.getNextIndex(step)

      this.$emit(direction, {
        original: this.currentIndex,
        next: nextIndex,
      })
      this.move(step)
      this.auto()
    },
    getNextIndex(step) {
      const slidersLen = this.sliderItems.length
      return (this.currentIndex + step + slidersLen) % slidersLen
    },
  },
}
</script>

<style lang="stylus" scoped>
.slider
  position relative
  overflow hidden
  &-items
    width 100%
    height 100%

  &-btn
    position absolute
    top 0
    z-index 999

    height 100%
    width 50px
    border none

    background rgba(0, 0, 0, .1)
    outline none
    transition background .3s
    cursor pointer
    &:hover .slider-icon
      border-color rgba(255, 255, 255, 1)
  &-btn-left
    left 0
    background linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0))
  &-btn-right
    right 0
    background linear-gradient(-90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0))
  &-icon
    display inline-block
    width 15px
    height 15px
    border-left 2px solid rgba(255, 255, 255, .6)
    border-bottom 2px solid rgba(255, 255, 255, .6)

    transition border .2s
  &-icon-left
    transform rotate(45deg)
  &-icon-right
    transform rotate(-135deg)

  &-indicators
    position absolute
    bottom 20px
    z-index 999
    &-center
      left 50%
      transform translateX(-50%)
    &-left
      left 6%
    &-right
      right 6%
  &-indicator-icon
    display inline-block
    width 10px
    height 10px
    margin 0 .1rem

    cursor pointer
    border-radius 50%
    background-color rgba( 0, 0, 0, .2)
  &-indicator-active
    background-color rgba( 255, 255, 255, .2)

  &-loading
    position absolute
    top 0
    left 0
    z-index 99
    width 100%
    height 100%
    background rgba(0, 0, 0, .1)
    display flex
    justify-content center
    align-items center

.ball-pulse
  & > div:nth-child(1)
    animation scale 0.75s -0.24s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08)
  & > div:nth-child(2)
    animation scale 0.75s -0.12s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08)
  & > div:nth-child(3)
    animation scale 0.75s 0s infinite cubic-bezier(0.2, 0.68, 0.18, 1.08)
  & > div
    background-color #fff
    width 15px
    height 15px
    border-radius 100%
    margin 2px
    animation-fill-mode both
    display inline-block

@keyframes scale
  0%
    transform scale(1)
    opacity 1
  45%
    transform scale(0.1)
    opacity 0.7
  80%
    transform scale(1)
    opacity 1
</style>
