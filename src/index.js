import Slider from './slider.vue'
import SliderItem from './slider-item.vue'

const SliderPlugin = {
  install(Vue) {
    Vue.component(Slider.name, Slider)
    Vue.component(SliderItem.name, SliderItem)
  },
}

export { Slider, SliderItem, SliderPlugin }
