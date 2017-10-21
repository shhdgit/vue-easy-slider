<template>
  <div id="app" class="container">
    <div>
      <h1>Vuejs Easy Slider Plugin</h1>
      <p class="lead">Slider Component of Vue.js with touch swipe support.</p>
      <p>
        <iframe src="https://ghbtns.com/github-btn.html?user=shhdgit&repo=vue-easy-slider&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe>
      </p>
    </div>
    <home></home>
  </div>
</template>

<script>
  import home from './components/Home'
  export default {
    name: 'app',
    components: {
      home
    }
  }
</script>

<style>
  .container {
    padding-top: 25px;
  }
</style>
