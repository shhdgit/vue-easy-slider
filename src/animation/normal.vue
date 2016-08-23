<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data () {
    return {
      width: ''
    }
  },

  methods: {
    scaleWidth ( width, childrenLen ) {
      let totalWidth = width * childrenLen

      this.width = width
      this.$el.style.width = `${ totalWidth }px`
    },
    animation ( position ) {
      this.$el.style.marginLeft = `${ position * -this.width }px`
    }
  },

  ready () {
    this.$dispatch( 'scaleSliderWidth', this.scaleWidth )
  }
}
</script>
