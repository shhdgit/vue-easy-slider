import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import { eslint } from 'rollup-plugin-eslint'
import { uglify } from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'

import pkg from './package.json'

const getPlugins = () => [
  eslint(),
  vue(),
  buble({
    transforms: { dangerousForOf: true },
  }),
]

const config = [
  {
    input: 'src/index.js',
    output: {
      name: 'VueEasySlider',
      file: pkg.main,
      format: 'cjs',
    },
    external: ['vue'],
    plugins: getPlugins(),
  },
  {
    input: 'src/index.js',
    output: {
      name: 'VueEasySlider',
      file: pkg.module,
      format: 'es',
    },
    external: ['vue'],
    plugins: getPlugins(),
  },
  {
    input: 'src/index.js',
    output: {
      name: 'VueEasySlider',
      file: pkg.browser,
      format: 'iife',
    },
    external: ['vue'],
    plugins: getPlugins(),
  },
]

const isProduction = process.env.NODE_ENV === `production`

if (isProduction) {
  config.forEach(c => {
    if (c.output.format === 'es') return
    c.plugins.push(uglify({}, minify))
  })
}

export default config
