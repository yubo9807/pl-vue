import { rollup } from 'rollup';
import typescript2 from 'rollup-plugin-typescript2';
import { replaceVersion } from './plugins/replace';
import { terser } from 'rollup-plugin-terser';

async function build(minifay: boolean) {
  const bundle = await rollup({
    input: `online/index.ts`,
    plugins: [
      typescript2({
        tsconfig: 'tsconfig.json',
      }),
      replaceVersion(),
      minifay && terser(),
    ],
  })
  await bundle.write({
    format: 'es',
    file: `online/${process.env.npm_package_version}/pl-vue${minifay ? '.min' : ''}.js`,
  });
  bundle.close();
}

build(false);
build(true);
