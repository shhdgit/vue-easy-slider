<template>
  <div>
    <!-- Demo here -->
    <br/>
    <h3>How to use</h3>
    <h4>Install</h4>
    <code>npm install vue-easy-slider --save</code>
    <h4>Use</h4>
    <code>import 'vue-easy-slider'</code>
    <div class="container">
      <slider animation="normal" :speed="1000">
        <slider-item v-for="(item, index) in list" :key="index" :style="{ backgroundImage: item.src }" :alt="item.description"></slider-item>
      </slider>
    </div>
    <h3>Found any bug or feature request?
      <a href="https://github.com/shhdgit/vue-easy-slider/issues">Report Here!</a>
    </h3>
    <br/>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data () {
      return {
        list: [{
          "src": "https://drscdn.500px.org/photo/118785927/m%3D2048/51dda482036d6d91f2902406c3e8f41f",
          "description": "Lorem"
        },
        {
          "src": "https://drscdn.500px.org/photo/118785927/m%3D2048/51dda482036d6d91f2902406c3e8f41f",
          "description": "Lorem ipsum"
        },
        {
          "src": "https://drscdn.500px.org/photo/118785927/m%3D2048/51dda482036d6d91f2902406c3e8f41f",
          "description": ""
        }]
      }
    }
  }
</script>

<style>

</style>
