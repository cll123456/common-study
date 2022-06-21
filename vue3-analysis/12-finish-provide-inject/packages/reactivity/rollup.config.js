import pkg from './package.json'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
const entry = [
  './src/index.ts',
]

const external = [
  'shared',
]

export default () => [
  {
    input: entry,
    output: {
      file: pkg.module,
      format: 'esm',
    },
    plugins: [
      esbuild({
        target: 'node14',
      }),
    ],
    external,
    onwarn(message) {
      if (message.code === 'CIRCULAR_DEPENDENCY')
        return
      console.error(message)
    },
  },
  {
    input: entry,
    output: {
      file: pkg.main,
      format: 'cjs',
    },
    plugins: [
      esbuild({
        target: 'node14',
      }),
    ],
    external,
    onwarn(message) {
      if (message.code === 'CIRCULAR_DEPENDENCY')
        return
      console.error(message)
    },
  },
  {
    input: entry,
    output: {
      file: pkg.types,
      format: 'esm',
    },
    plugins: [
      dts(),
    ],
  },
]
