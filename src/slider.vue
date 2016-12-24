<template>
  <div class="slider"
       :style="{ width: width, height: height }">
    <component :is="animation"
               :style="{ transition: 'all ' + thisSpeed + 's' }"
               :speed="thisSpeed"
               class="slider-content"
               ref="content">
      <slot></slot>
    </component>

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
         v-for="( item, index ) in childrenArr"
         :class="{ 'slider-indicator-active': posFlag === index }"
         @click="jump2( index )"></i>
    </div>
  </div>
</template>

<script>
  import { normal, fade } from './animation'

  export default {
    data () {
      return {
        posFlag: 0,
        childrenArr: [],
        timer: null
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
      autoplay () {
        let timer

        // Get animation's vm
        let content = this.$refs.content,
            _this = this,
            originPos = this.posFlag

        function setTimer () {
          return setInterval( () => {
            if ( _this.posFlag < content.$children.length - 1 ) {
              _this.posFlag++
            } else {
              _this.posFlag = 0
            }

            content.animation( originPos, _this.posFlag )
          }, _this.interval )
        }

        return function () {
          if ( !!this.timer ) {
            clearInterval( this.timer )
            this.timer = setTimer()
          } else {
            // Config autoplay & slider item large than 2, coz slider is one of items
            if ( _this.auto && content.$children.length > 1 ) {
              this.timer = setTimer()
            }
          }
        }

      },
      next () {
        let content = this.$refs.content,
            originPos = this.posFlag

        if ( this.posFlag < content.$children.length - 1 ) {
          ++this.posFlag
        } else {
          this.posFlag = 0
        }

        content.animation( originPos, this.posFlag )
        // Clean the Timer, reset autoplay's interval time.
        this.autoplay()
      },
      preview () {
        let content = this.$refs.content,
            originPos = this.posFlag

        if ( this.posFlag > 0 ) {
          --this.posFlag
        } else {
          this.posFlag = content.$children.length - 1
        }

        content.animation( originPos, this.posFlag, 'preview' )
        this.autoplay()
      },
      jump2 ( index ) {
        let content = this.$refs.content,
            originPos = this.posFlag

        content.animation( originPos, index, 'jump' )
        this.posFlag = index
        this.autoplay()
      },

      addChildrenLength () {
        this.childrenArr.push( this.childrenArr.length )
      },
      scaleItemsWidth ( item ) {
        item.style.width = `${ this.$el.clientWidth }px`
      },

      newItem ( item ) {
        const sliderContent = this.$refs.content

        this.addChildrenLength()
        this.scaleItemsWidth( item )

        if ( sliderContent.scaleWidth ) {
          sliderContent.scaleWidth( this.$el.clientWidth )
        }

        this.autoplay()
      }
    },

    mounted () {
      // Init autoplay function.
      this.autoplay = this.autoplay()
      this.autoplay()
    },

    beforeDestroy () {
      clearInterval(this.timer)
    },

    components: {
      normal,
      fade
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
    z-index: 99;

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
