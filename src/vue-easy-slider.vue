<template>
  <div class="slider" :style="{ width: width, height: height }" @mouseenter="throttleToggleAnimation" @mouseleave="throttleToggleAnimation">
    <div class="slider-content" ref="content">
      <transition-group appear :name="transitionName" mode="out-in" tag="div">
        <slot></slot>
      </transition-group>
    </div>
    <template v-if="controlBtn">
      <div class="slider-btn slider-left-btn" @click.stop="previous">
        <i class="slider-icon slider-icon-left"></i>
      </div>
      <div class="slider-btn slider-right-btn" @click.stop="next">
        <i class="slider-icon slider-icon-right"></i>
      </div>
    </template>
    <div class="slider-indicators" v-if="indicators" @click.stop>
      <i class="slider-indicator-icon" v-for="(item, index) in itemsCount" :key="index" :class="{ 'slider-indicator-active': current === index }" @click="jumpTo( index )"></i>
    </div>
  </div>
</template>

<script>
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
        transitionName: 'slide-right',
        current: null,
        itemsCount: 0,
        timer: null,
        isPaused: false
      }
    },
    watch: {
      current (index) {
        let items = this.$refs.content.children[0].children
        for (var i = 0; i < items.length; i++) {
          if (i === index) {
            items[i].style.display = "block"
          } else {
            items[i].style.display = "none"
          }
        }
        //TODO replace this code with v-if for transiton effect
      }
    },
    computed: {},
    methods: {
      toggleAnimation () {
        this.isPaused = !this.isPaused
        this.autoplay()
      },
      throttleToggleAnimation () {
        clearInterval(this.timer)
        debounce(this.toggleAnimation, this.speed, { leading: true })()
      },
      setItemsCount () {
        this.itemsCount = this.$refs.content.children[0].children.length
      },
      autoplay () {
        if (!this.isPaused) {
          if (this.current === null) this.current = 0
          this.timer = window.setInterval(() => {
            this.next()
          }, this.interval + this.speed)
        }
      },
      next () {
        if (this.current < this.itemsCount - 1) {
          this.current++
        } else {
          this.current = 0
        }
      },
      previous () {
        if (this.current > 0) {
          this.current--
        } else {
          this.current = this.itemsCount - 1
        }
      },
      jumpTo (index) {
        this.current = index
      }
    },
    mounted () {
      //add slider-item class to all items
      let items = this.$refs.content.children[0].children
      for (var i = 0; i < items.length; i++) {
        items[i].classList.add('slider-item')
      }
      // Init autoplay function.
      this.$nextTick(() => {
        this.setItemsCount()
        this.autoplay()
      })
    }
  }
</script>

<style>
  .slider {
    position: relative;
    overflow: hidden;
  }

  .slider-content {
    position: relative;
    height: 100%;
  }

  .slider-indicators {
    position: absolute;
    bottom: 0;
    z-index: 99;
    left: 50%;
    transform: translateX( -50%);
  }

  .slider-indicator-icon {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin: .5rem;
    cursor: pointer;
    border-radius: 50%;
    background-color: rgba( 0, 0, 0, .5);
    border: 1px solid rgba( 255, 255, 255, .5);
  }

  .slider-indicator-active {
    background-color: rgba( 255, 255, 255, .5);
    border: 1px solid rgba( 0, 0, 0, .5);
  }

  .slider-btn {
    position: absolute;
    top: 50%;
    z-index: 99;
    transform: translateY( -50%);
    cursor: pointer;
    background-color: #000;
    transition: opacity .3s;
    opacity: .33;
  }

  .slider-btn:hover {
    opacity: .5;
  }

  .slider-left-btn {
    left: 0;
    padding: 2rem 1rem 1.5rem 2rem;
  }

  .slider-right-btn {
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

  .slider-icon-left {
    transform: rotate( 45deg);
  }

  .slider-icon-right {
    transform: rotate( -135deg);
  }

  .slider-item {
    width: 100%;
    height: 100%;
    position: relative;
    display: none;
  }
</style>
