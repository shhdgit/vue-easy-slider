<template>
  <div class="slider" :style="{ width: width, height: height }">
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
        type: Boolean,
        default: true
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
    data () {
      return {
        transitionName: 'slide-right',
        current: 0,
        itemsCount: 0,
        timer: null
      }
    },
    computed: {
      thisSpeed () {
        return (this.speed / 1000).toFixed(2)
      }
    },

    methods: {
      setItemsCount () {
        this.itemsCount = this.$refs.content.children[0].children.length
      },
      autoplay () { },
      next () { },
      previous () { },
      jumpTo () { }
    },

    mounted () {
      let items = this.$refs.content.children[0].children
      for (var i = 0; i < items.length; i++) {
        items[i].classList.add('slider-item')
      }

      this.$nextTick(() => {
        this.setItemsCount()
        // Init autoplay function.
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
