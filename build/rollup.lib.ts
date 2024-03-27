import { rollup } from 'rollup';
import typescript2 from 'rollup-plugin-typescript2';
import replaceModuleName from './plugins/replace-module-name';
import removeFunc from './plugins/remove-func';

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
    external: ['../utils', '../reactivity', '../vdom'],
  },
  {
    file: 'router/index',
    external: ['../utils', '../reactivity', '../vdom'],
  },
]

const esmFuncs = ['ssrOutlet'];

async function esmBuild(file, external) {
  const bundle = await rollup({
    input: `core/${file}.ts`,
    external,
    plugins: [
      typescript2({
        tsconfig: 'tsconfig.json',
      }),
      removeFunc(...esmFuncs),
    ],
  })
  await bundle.write({
    format: 'es',
    file: `lib/${file}.js`,
  });
  await bundle.close();
}

const cjsFuncs = [
  'render',
  'onMounted', 'onUnmounted',
  'onBeforeMount', 'onBeforeUnmount',
  'defineExpose',
  'printWarn'
];

async function cjsBuild(file, external) {
  const bundle = await rollup({
    input: `core/${file}.ts`,
    external,
    plugins: [
      typescript2({
        tsconfig: 'tsconfig.json',
      }),
      removeFunc(...cjsFuncs),
      replaceModuleName(),
    ],
  })
  await bundle.write({
    format: 'cjs',
    file: `lib/${file}.cjs`,
  });
  await bundle.close();
}

builds.forEach(val => {
  esmBuild(val.file, val.external);
  cjsBuild(val.file, val.external);
})

rollup({
  input: `core/jsx.ts`,
  external: ['./utils', './dom'],
  plugins: [
    typescript2({
      tsconfig: 'tsconfig.json',
    }),
  ],
}).then(async bundle => {
  await bundle.write({
    format: 'es',
    file: `lib/jsx.d.ts`,
  });
  bundle.close();
})