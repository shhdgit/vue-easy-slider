import base from './rollup.config.base'
import pkg from '../package.json'

const config = Object.assign({}, base, {
  output: {
    name: 'vue-easy-slider',
    file: pkg.module,
    format: 'es',
  },
})

export default config
