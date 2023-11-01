const typescript2 = require('rollup-plugin-typescript2');
const replaceModuleName = require('./plugins/replace-module-name');

const builds = [
  {
    file: 'utils/index',
    external: [],
  },
  {
    file: 'reactivity/index',
    external: ['../utils'],
  },
  {
    file: 'vdom/index',
    external: ['../utils', '../../utils', '../reactivity'],
  },
  {
    file: 'index',
    external: ['./utils', './reactivity', './vdom'],
  },
  {
    file: 'store/index',
    external: ['../utils', '../reactivity'],
  },
  {
    file: 'router/index',
    external: ['../utils', '../reactivity', '../vdom'],
  },
]

exports.default = builds.map(val => ({
  input: `core/${val.file}.ts`,
  output: [
    {
      format: 'es',
      file: `lib/${val.file}.js`,
    },
    {
      format: 'cjs',
      file: `lib/${val.file}.cjs`,
    },
  ],
  external: val.external,
  plugins: [
    typescript2({
      tsconfig: 'build/tsconfig.lib.json',
    }),
    replaceModuleName(),
  ],
}))
