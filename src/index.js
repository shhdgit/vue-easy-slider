import slider from './vue-easy-slider'

const vueEasySlider = {
  install: function (Vue) {
    Vue.component(slider.name, slider)
  }
}

export default vueEasySlider

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vueEasySlider)
}
