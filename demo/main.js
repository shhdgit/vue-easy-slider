import './pollyfills'
import './plugins'

import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

import './assets/css/bootstrap.css'
import './assets/css/index.css'
