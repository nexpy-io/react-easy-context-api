import typescript from 'rollup-plugin-typescript2'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

import packageSettings from './package.json'

export default [
  {
    input: 'src/index.tsx',
    output: {
      file: packageSettings.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: true,
    },
    plugins: [typescript(), commonjs(), terser()],
    external: ['react', 'react-native', 'react-dom', 'react/jsx-runtime', 'scheduler'],
  },
  {
    input: 'src/native/index.tsx',
    output: {
      file: `${packageSettings.main.replace('.js', '')}.native.js`,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: true,
    },
    plugins: [typescript(), commonjs(), terser()],
    external: ['react', 'react-native', 'react-dom', 'react/jsx-runtime', 'scheduler'],
  },
]
