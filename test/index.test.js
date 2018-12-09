import { createLocalVue } from '@vue/test-utils'

import EasySlider, { Slider, SliderItem } from '../dist/vue-easy-slider.esm'

describe('Component name', () => {
  test('is Slider', () => {
    expect(Slider.name).toEqual('Slider')
  })
  // Used in Slider init function
  test('is SliderItem', () => {
    expect(SliderItem.name).toEqual('SliderItem')
  })
})

describe('Plugin', () => {
  test('can install', () => {
    const localVue = createLocalVue()

    localVue.use(EasySlider)
  })
})
