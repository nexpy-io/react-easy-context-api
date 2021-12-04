import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import { uglify } from 'rollup-plugin-uglify'

import packageSettings from './package.json'

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: packageSettings.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: true,
    },
  ],
  plugins: [typescript(), commonjs(), resolve(), uglify()],
  external: ['react', 'react-dom', 'react/jsx-runtime'],
}