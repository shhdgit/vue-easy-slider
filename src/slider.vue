<template>
  <div :style="{ width: width, height: height }" class="slider">
    <div class="items">
      <slot></slot>
    </div>
    <div :class="`indicators indi-${ indicators }`" @click.stop v-if="indicators">
      <span
      :key="i"
      :class="{ 'slider-indicator-active': nowItemIndex === i - 1 }"
      @click="indicatorHandle(i - 1)"
      v-for="i in childrenLength" class="slider-indicator-icon"></span>
    </div>
    <button @click.stop="prev" v-if="controlBtn" class="btn btn-left">
      <i class="slider-icon slider-icon-left"></i>
    </button>
    <button @click.stop="next" v-if="controlBtn" class="btn btn-right">
      <i class="slider-icon slider-icon-right"></i>
    </button>
  </div>
</template>

<script>
/* eslint-disable */
  import { throttle, debounce } from './utils'

  export default {
    data () {
      return {
        children: [],
        nowItemIndex: 0,
        timer: 0,
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
      },
      initIndex: {
        type: Number,
        default: 0,
      },
      currentIndex: {
        type: Number,
        default: -1
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

    computed: {
      childrenLength () {
        return this.children.length
      },
    },

    methods: {
      updateItems () {
        this.children = this.$children.filter(child => {
          return child.$options.name === 'easy-slider-item'
        })
        this.nowItemIndex = this.initIndex

        const nowItem = this.children[this.nowItemIndex]
        nowItem && nowItem.initItem()
        this.$nextTick(() => {
          if (nowItem) {
            this.handleSetTopItem(nowItem)
            this.autoplay()
          }
        })
      },
      handleSetTopItem (nextItem, prevItem) {
        if (nextItem && nextItem.$el) nextItem.$el.style.zIndex = 99
        if (prevItem && prevItem.$el) prevItem.$el.style.zIndex = 98
      },
      autoplay () {
        if (!this.auto || this.childrenLength < 2) return
        const self = this
        function setTimer () {
          return setInterval(() => {
            if(!self.auto) return
            const nextIndex = (self.nowItemIndex + 1) % self.childrenLength
            self.jump(nextIndex)
          }, self.interval)
        }
        if (this.timer) clearInterval(this.timer)
        this.timer = setTimer()
      },
      jump (i) {
        const nowItem = this.children[this.nowItemIndex]
        const nextItem = this.children[i]
        const indexGap = i - this.nowItemIndex
        let direction = indexGap > 0
        if (indexGap === -(this.childrenLength - 1)) direction = true
        if (indexGap === this.childrenLength - 1) direction = false
        if (nowItem && nextItem) {
          nowItem.hideHandle(direction)
          nextItem.showHandle(direction)
          this.nowItemIndex = i
          this.$emit('changeSlide', { index: i });
        }
      },
      prev () {
        if (!this.beforePrevious()) return
        if (this.childrenLength < 2) return
        const nextIndex = this.nowItemIndex - 1 === -1 ? this.childrenLength - 1 : this.nowItemIndex - 1
        this.$emit('previous', { original: this.nowItemIndex, next: nextIndex });
        this.jump(nextIndex)
        this.autoplay()
      },
      next () {
        if (!this.beforeNext()) return
        if (this.childrenLength < 2) return
        const nextIndex = (this.nowItemIndex + 1) % this.childrenLength
        this.$emit('next', { original: this.nowItemIndex, next: nextIndex });
        this.jump(nextIndex)
        this.autoplay()
      },
      indicatorHandle (i) {
        if (this.childrenLength < 2) return
        if (i === this.nowItemIndex) return
        this.jump(i)
        this.autoplay()
      },
    },

    watch: {
        currentIndex(newIndex) {
            if (newIndex !== -1) {
                this.jump(newIndex);
            }
        }
    },

    created () {
      this.handleItemChange = throttle(this.updateItems, 100)
      this.jump = debounce(this.jump, this.speed + 100)
    },

    beforeMount () {
      this.handleItemChange()
    },

    activated () {
      this.handleItemChange()
    },

    beforeDestroy () {
      this.timer && clearTimeout(this.timer)
    },

    deactivated () {
      this.timer && clearTimeout(this.timer)
    },
  }
</script>

<style lang="less" scoped>
  .slider {
    position: relative;
    overflow: hidden;

    &:hover {
      .btn-left {
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
      }
      .btn-right {
        background: linear-gradient(-90deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
      }
    }
  }

  .items {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .btn {
    position: absolute;
    top: 0;
    z-index: 999;

    height: 100%;
    width: 50px;
    border: none;

    background: rgba(0, 0, 0, .1);
    outline: none;
    transition: background .3s;
    cursor: pointer;
  }

  .btn-left {
    left: 0;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
  }

  .btn-right {
    right: 0;
    background: linear-gradient(-90deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
  }

  .slider-icon {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-left: 2px solid rgba(255, 255, 255, .6);
    border-bottom: 2px solid rgba(255, 255, 255, .6);

    transition: border .2s;
  }

  .slider-icon-left {
    transform: rotate( 45deg);
  }

  .slider-icon-right {
    transform: rotate( -135deg);
  }

  .btn:hover .slider-icon {
    border-color: rgba(255, 255, 255, 1);
  }

  .indicators {
    position: absolute;
    bottom: 20px;
    z-index: 999;
  }

  .indi-center {
    left: 50%;
    transform: translateX(-50%);
  }

  .indi-left {
    left: 6%;
  }

  .indi-right {
    right: 6%;
  }

  .slider-indicator-icon {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin: 0 .1rem;

    cursor: pointer;
    border-radius: 50%;
    background-color: rgba( 0, 0, 0, .2);
  }

  .slider-indicator-active {
    background-color: rgba( 255, 255, 255, .2);
  }
</style>
