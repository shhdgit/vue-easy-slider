<template>
  <div class="slider" :style="{ width: width, height: height }" @mouseenter="throttleToggleAnimation" @mouseleave="throttleToggleAnimation">
    <!-- appear animation for slider-->
    <transition appear name="slide-up" mode="out-in" tag="div">
      <div v-touch:swipe.right="swipeHandleRight" v-touch:swipe.left="swipeHandleLeft">
        <div class="slider-content" ref="content">
          <!-- vuejs transitions -->
          <transition-group :name="animation" mode="out-in" tag="div">
            <!-- required for transition -->
            <div v-for="(slide, index) in slides" :key="index" class="slider-item" v-html="slide" v-show="index === currentIndex"></div>
          </transition-group>
        </div>
        <template v-if="controls">
          <div class="slider-btn left" @click.stop="previous">
            <i class="slider-icon left"></i>
          </div>
          <div class="slider-btn right" @click.stop="next">
            <i class="slider-icon right"></i>
          </div>
        </template>
        <div class="slider-indicators" v-if="indicators" @click.stop>
          <i class="slider-indicator-icon" v-for="(item, index) in itemsCount" :key="index" :class="{ 'slider-indicator-active': currentIndex === index }" @click="jumpTo( index )"></i>
        </div>
      </div>
    </transition>
    <div style="display: none!important; visibility: hidden!important;">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import './animations.css'
  import * as debounce from 'lodash.debounce'

  export default {
    name: 'slider',
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
        default: 1000
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
        type: Boolean,
        default: true
      },
      controls: {
        type: Boolean,
        default: true
      },
      animation: {
        type: String,
        default: 'slide-right'
      },
      pauseOnHover: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        currentIndex: null,
        timer: null,
        isPaused: false,
        slides: []
      }
    },
    watch: {},
    computed: {
      itemsCount () {
        return this.slides.length
      }
    },
    methods: {
      toggleAnimation () {
        this.isPaused = !this.isPaused
        this.autoplay()
      },
      throttleToggleAnimation () {
        clearInterval(this.timer)
        debounce(this.toggleAnimation, this.speed, { leading: true })()
      },
      autoplay () {
        if (!this.isPaused) {
          if (this.currentIndex === null) this.currentIndex = 0
          this.timer = window.setInterval(() => {
            this.next()
          }, this.interval + this.speed)
        }
      },
      swipeHandleRight () {
        clearInterval(this.timer)
        this.previous()
        this.autoplay()
      },
      swipeHandleLeft () {
        clearInterval(this.timer)
        this.next()
        this.autoplay()
      },
      next () {
        if (this.currentIndex < this.itemsCount - 1) {
          this.currentIndex++
        } else {
          this.currentIndex = 0
        }
      },
      previous () {
        if (this.currentIndex > 0) {
          this.currentIndex--
        } else {
          this.currentIndex = this.itemsCount - 1
        }
      },
      jumpTo (index) {
        this.currentIndex = index
      },
      copySlots () {
        // copy slots to manual list to prepare custom structure
        this.$slots.default.forEach(item => {
          let tmp = item.elm.innerHTML
          this.slides.push(tmp)
        })
      }
    },
    created () {},
    mounted () {
      this.copySlots()
      // Init autoplay function.
      this.$nextTick(() => {
        this.autoplay()
      })
    }
  }
</script>

<style>
  .slider {
    position: relative;
    overflow: hidden;
    user-select: none;
    -webkit-user-select: none;
  }

  .slider-content {
    position: relative;
    height: 100%;
  }

  .slider-indicators {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .slider-indicator-icon {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin: 0.5rem;
    cursor: pointer;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.5);
  }

  .slider-indicator-active {
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid rgba(0, 0, 0, 0.5);
  }

  .slider-btn {
    position: absolute;
    top: 50%;
    z-index: 99;
    transform: translateY(-50%);
    cursor: pointer;
    background-color: #000;
    transition: opacity 0.3s;
    opacity: 0.5;
  }

  .slider-btn:hover {
    opacity: 0.75;
  }

  .slider-btn.left {
    left: 0;
    padding: 2rem 1rem 1.5rem 2rem;
  }

  .slider-btn.right {
    right: 0;
    padding: 2rem 2rem 1.5rem 1rem;
  }

  .slider-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #fff;
  }

  .slider-icon.left {
    transform: rotate(45deg);
  }

  .slider-icon.right {
    transform: rotate(-135deg);
  }

  @media (max-width: 760px), screen and (orientation: portrait) {
    .slider-btn {
      display: none;
    }
  }

  .slider-item {
    width: 100%;
    height: 100%;
    position: relative;
  }
</style>
