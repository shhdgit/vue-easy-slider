<template>
  <div class="slider-item">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    methods: {
      scaleItemWidth ( width ) {
        this.$el.style.width = `${ width }px`
      }
    },

    ready () {
      this.$dispatch( 'scaleItemsWidth', this.scaleItemWidth )
      this.$dispatch( 'addChildrenLength' )
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
