import Slider from './slider.vue'
import SliderItem from './slider-item.vue'

const plugin = {
  // eslint-disable-next-line no-undef
  version: VERSION,
  install(Vue) {
    Vue.component(Slider.name, Slider)
    Vue.component(SliderItem.name, SliderItem)
  },
}

export { Slider, SliderItem }
export default plugin
