import eslint from '@rollup/plugin-eslint'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

const banner = '/*! (c) Brandon Aaron - ISC */'

export default [
  // The es module output, also outputs the unit tests
  {
    input: {
      'index': 'src/index.ts',
      'DarkPref': 'src/DarkPref.ts',
      'DarkPrefToggleElement': 'src/DarkPrefToggleElement.ts',
      'DarkPrefToggleBaseElement': 'src/DarkPrefToggleBaseElement.ts'
    },
    output: {
      banner,
      dir: 'dist',
      format: 'es',
      sourcemap: true
    },
    plugins: [eslint({ throwOnError: true }), typescript()],
    watch: true
  },

  // The minimal blocking
  {
    input: 'src/DarkPref.blocking.ts',
    output: {
      file: 'dist/DarkPref.blocking.js',
      format: 'es'
    },
    plugins: [eslint({ throwOnError: true }), typescript(), terser()],
    watch: true
  }
]
