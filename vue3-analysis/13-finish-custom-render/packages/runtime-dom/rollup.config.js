import pkg from './package.json'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import { nodeResolve } from '@rollup/plugin-node-resolve';

const entry = [
  './src/index.ts',
]

const external = [
  // 'shared',
  // 'runtime-core'
]

/**
 * @type {import('rollup').RollupOptions}
 */
export default () => [
  {
    input: entry,
    output: {
      file: pkg.module,
      format: 'esm',
    },
    plugins: [
      nodeResolve(),
      esbuild({
        target: 'es2016',
      }),

    ],
    external
  },
  {
    input: entry,
    output: {
      file: pkg.main,
      format: 'cjs',
    },
    plugins: [
      nodeResolve(),
      esbuild({
        target: 'es2016',
        minify: true
      }),

    ],
    external
  },
  {
    input: entry,
    output: {
      file: pkg.types,
      format: 'esm',
    },
    plugins: [
      nodeResolve(),
      dts(),
    ],
  },
]
