import base from './rollup.config.base'
import pkg from '../package.json'

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name: 'vue-easy-slider',
    file: pkg.main,
    format: 'umd',
  },
})

export default config
