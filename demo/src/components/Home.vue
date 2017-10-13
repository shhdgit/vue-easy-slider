<template>
  <div>
    <div>
      <slider :speed="1500">
        <div v-for="(item, index) in list" :key="index">
          <img :src="item.src" :alt="item.description">
          <span v-html="item.description"></span>
        </div>
      </slider>
    </div>
    <br>
    <h3>How to use</h3>
    <h4>Install</h4>
    <code>npm install vue-easy-slider --save</code>
    <h4>Use with npm</h4>
    <code>import Vue from 'vue'</code><br>
    <code>import slider 'vue-easy-slider'</code><br>
    <code>Vue.use(slider)</code><br>
    <h4>Use with browser</h4>
    <p>Just link the script and you are ready to go.</p>
    <h3>How to customize</h3>
    <p>You can customize slide and its contents style using the class
      <code>slider-item</code>
    </p>
    <h3>Documentation</h3>
    <p>Please visit the
      <a href="https://github.com/shhdgit/vue-easy-slider/#usage">Readme</a> for options and guide.</p>
    <h3>Found any bug or feature request?
      <a href="https://github.com/shhdgit/vue-easy-slider/issues">Report Here!</a>
    </h3>
    <br>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data () {
      return {
        list: [{
          "src": "https://drscdn.500px.org/photo/118785927/m%3D2048/51dda482036d6d91f2902406c3e8f41f",
          "description": "Title here"
        },
        {
          "src": "https://drscdn.500px.org/photo/118785927/m%3D2048/51dda482036d6d91f2902406c3e8f41f",
          "description": "Another Title"
        },
        {
          "src": "https://drscdn.500px.org/photo/118785927/m%3D2048/51dda482036d6d91f2902406c3e8f41f",
          "description": "Here it is again"
        }]
      }
    }
  }
</script>

<style>
  .slider-item img {
    width: 100%;
    height: auto;
  }

  .slider-item span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    text-align: center;
    top: 0.5rem;
    font-size: 1.5em;
    color: rgba(255, 255, 255, 1);
    text-shadow: 0 0 1px rgba(0, 0, 0, 0.5);
  }
</style>
