import Slider from './slider.vue'
import SliderItem from './slider-item.vue'

const VueEasySlider = {
  install(Vue) {
    Vue.component(Slider.name, Slider)
    Vue.component(SliderItem.name, SliderItem)
  },
}

export default VueEasySlider
export { Slider, SliderItem }
