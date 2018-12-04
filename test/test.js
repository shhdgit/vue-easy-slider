import { Slider, SliderItem } from '../src'

describe('Component name', () => {
  test('is Slider', () => {
    expect(Slider.name).toEqual('Slider')
  })
  // Used in Slider init function
  test('is SliderItem', () => {
    expect(SliderItem.name).toEqual('SliderItem')
  })
})
