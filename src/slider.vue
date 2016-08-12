<template>
  <div class="slider"
       :style="{ width: width, height: height }">
    <div class="slider-content"
         :style="{ width: $children.length * 100 + '%', transition: 'margin ' + thisSpeed + 's' }"
         v-el:content>
      <slot></slot>
    </div>

    <div class="slider-btn slider-left-btn"
         @click.stop="preview"
         v-if="controlBtn">
      <i class="slider-icon slider-icon-left"></i>
    </div>
    <div class="slider-btn slider-right-btn"
         @click.stop="next"
         v-if="controlBtn">
      <i class="slider-icon slider-icon-right"></i>
    </div>

    <div class="slider-indicators"
         v-if="indicators !== false"
         :class="indicatorClass"
         @click.stop>
      <i class="slider-indicator-icon"
         :class="{ 'slider-indicator-active': posFlag === $index }"
         v-for="i in $children"
         @click="jump2( $index )"></i>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        posFlag: 0,
        parentWidth: ''
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
      }
    },

    computed: {
      thisSpeed () {
        let speed = this.speed / 1000

        return speed.toFixed( 2 )
      },
      indicatorClass () {
        if ( this.indicators ) {
          return `slider-${ this.indicators }`
        }
      }
    },

    methods: {
      scaleWidth () {
        let sliderItem = this.$children,
            width = this.$el.parentElement.clientWidth + 'px'

        sliderItem.forEach( item => {
          item.$el.style.width = width
        } )

        // Parent element width, decide single slider-item's width
        this.parentWidth = this.$el.parentElement.clientWidth
      },
      autoplay () {
        let timer

        let length = this.$children.length,
            content = this.$els.content,
            _this = this

        function setTimer () {
          return setInterval( () => {
            if ( _this.posFlag < length - 1 ) {
              _this.posFlag++
            } else {
              _this.posFlag = 0
            }

            content.style.marginLeft = _this.posFlag * -_this.parentWidth + 'px'
          }, _this.interval )
        }

        return function () {
          if ( !!timer ) {
            clearInterval( timer )
            timer = setTimer()
          } else {
            // Config autoplay & slider item large than 1
            if ( _this.auto && length > 1 ) {
              timer = setTimer()
            }
          }
        }

      },
      next () {
        let content = this.$els.content

        if ( this.posFlag < this.$children.length - 1 ) {
          content.style.marginLeft = ++this.posFlag  * -this.parentWidth + 'px'
        } else {
          content.style.marginLeft = 0
          this.posFlag = 0
        }

        // Clean the Timer, reset autoplay's interval time.
        this.autoplay()
      },
      preview () {
        let content = this.$els.content

        if ( this.posFlag > 0 ) {
          content.style.marginLeft = --this.posFlag * -this.parentWidth + 'px'
        } else {
          content.style.marginLeft = ( this.$children.length - 1 ) * -this.parentWidth + 'px'
          this.posFlag = this.$children.length - 1
        }

        this.autoplay()
      },
      jump2 ( index ) {
        let content = this.$els.content

        content.style.marginLeft = index * -this.parentWidth + 'px'
        this.posFlag = index
        this.autoplay()
      }
    },

    ready () {
      this.scaleWidth()
      // Init autoplay function.
      this.autoplay = this.autoplay()
      this.autoplay()
    }
  }
</script>

<style scoped>
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

    padding: 1rem;
  }
  .slider-center {
    left: 50%;

    transform: translateX( -50% );
  }
  .slider-left {
    left: 0;
  }
  .slider-right {
    right: 0;
  }
  .slider-indicator-icon {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin: 0 .1rem;

    cursor: pointer;
    border-radius: 50%;
    background-color: rgba( 0, 0, 0, .2 );
  }
  .slider-indicator-active {
    background-color: rgba( 255, 255, 255, .2 );
  }
  .slider-btn {
    position: absolute;
    top: 50%;

    transform: translateY( -50% );
    cursor: pointer;
    background-color: #000;
    transition: opacity .3s;
    opacity: .3;
  }
  .slider-btn:hover {
    opacity: .5;
  }
  .slider-left-btn {
    left: 0;

    padding: 1rem .5rem .75rem .8rem;
  }
  .slider-right-btn {
    right: 0;

    padding: 1rem .8rem .75rem .5rem;
  }
  .slider-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-left: 2px solid #fff;
    border-bottom: 2px solid #fff;
  }
  .slider-icon-left {
    transform: rotate( 45deg );
  }
  .slider-icon-right {
    transform: rotate( -135deg );
  }
</style>
