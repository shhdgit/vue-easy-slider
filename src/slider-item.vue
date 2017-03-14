<template>
<div class="slider-item">
  <slot></slot>
</div>
</template>

<script>
export default {
  data () {
    return {
      test: {},
    }
  },

  beforeCreate () {
    // console.log(this)
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
