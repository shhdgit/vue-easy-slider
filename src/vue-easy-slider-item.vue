<template>
  <div class="slider-item">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'slider-item',
    mounted () {
      this.$parent.$parent.newItem(this.$el)
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
