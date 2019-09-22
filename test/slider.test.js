import { mount } from '@vue/test-utils'
import flushPromises from 'flush-promises'

import { Slider, SliderItem } from '../dist/vue-easy-slider.esm'

describe('Slider', () => {
  describe('has hook', () => {
    test('created', () => {
      expect(typeof Slider.created).toEqual('function')
    })
    test('mounted', () => {
      expect(typeof Slider.mounted).toEqual('function')
    })
    test('activated', () => {
      expect(typeof Slider.activated).toEqual('function')
    })
    test('beforeDestroy', () => {
      expect(typeof Slider.beforeDestroy).toEqual('function')
    })
    test('deactivated', () => {
      expect(typeof Slider.deactivated).toEqual('function')
    })
  })
})

describe('Slider Item', () => {
  const wrapper = mount(SliderItem)
  const vm = wrapper.vm

  test('init function', async () => {
    vm.init()
    expect(vm.isInit).toBeTruthy()
    expect(vm.display).toBeTruthy()
    expect(vm.initAnimation).toBeTruthy()
    await flushPromises()
    expect(vm.initAnimation).toBeFalsy()
  })
})
