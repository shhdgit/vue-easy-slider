import { uglify } from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'

import base from './rollup.config.base'
import pkg from '../package.json'

const config = Object.assign({}, base, {
  output: {
    exports: 'named',
    name: 'VueEasySlider',
    file: pkg.unpkg,
    format: 'iife',
  },
})

config.plugins.push(uglify({}, minify))

export default config
