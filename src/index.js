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

let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(plugin)
}
