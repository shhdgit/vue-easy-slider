<template>
  <div class="slider-item">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    mounted () {
      const sliderContent = this.$parent

      sliderContent.$parent.newItem(this.$el)
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
