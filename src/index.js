import slider from './vue-easy-slider'
import sliderItem from './vue-easy-slider-item'

const vueEasySlider = {
  install: function (Vue) {
    Vue.component(slider.name, slider)
    Vue.component(sliderItem.name, sliderItem)
  }
}

export default vueEasySlider

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(vueEasySlider)
}
