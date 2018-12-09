import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import cjs from 'rollup-plugin-commonjs'
import { eslint } from 'rollup-plugin-eslint'

import pkg from '../package.json'

export default {
  input: 'src/index.js',
  external: ['vue'],
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    cjs(),
    eslint(),
    vue(),
    buble({
      transforms: { dangerousForOf: true },
    }),
    replace({
      VERSION: JSON.stringify(pkg.version),
    }),
  ],
}
