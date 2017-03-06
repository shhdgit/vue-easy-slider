<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data () {
    return {
      width: '',
      childrenLen: 0
    }
  },

  methods: {
    scaleWidth ( width ) {
      let totalWidth = width * ++this.childrenLen

      this.width = width
      this.$el.style.width = `${ totalWidth }px`
    },
    animation ( origin, position, flag ) {
      this.$el.style.transform = `translate3d( ${ position * -this.width }px, 0, 0 )`
      this.$el.style.webkitTransform = `translate3d( ${ position * -this.width }px, 0, 0 )`
    }
  }
}
</script>
