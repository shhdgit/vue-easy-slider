import Vue, { PluginObject, PluginFunction } from 'vue'

export class SliderPlugin implements PluginObject<{}> {
  install: PluginFunction<{}>
  static install(pVue: typeof Vue, options?: {} | undefined): void
}

export class Slider extends Vue {}
export class SliderItem extends Vue {}
