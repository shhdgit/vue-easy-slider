import Vue, { PluginObject, PluginFunction, Component } from 'vue'

export class SliderPlugin implements PluginObject<{}> {
  install: PluginFunction<{}>
  static install(pVue: typeof Vue, options?: {} | undefined): void
}

export type Slider = Component
export type SliderItem = Component
