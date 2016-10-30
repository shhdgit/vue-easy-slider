<template>
  <div class="slider-item">
    <slot></slot>
  </div>
</template>

<script>
  import { eventHub } from './event'

  export default {
    mounted () {
      const sliderContent = this.$parent

      eventHub.$emit( 'newItem', this.$el )
    }
  }
</script>

<style scoped>
  .slider-item {
    float: left;

    width: 100%;
    height: 100%;
  }
</style>
