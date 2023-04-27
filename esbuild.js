const { build } = require("esbuild");

build({
  entryPoints: ["vue/simple.ts"],
  outfile: "dist/vue-reactivity.js",
  bundle: true,
  minify: true,
  tsconfig: './tsconfig.json',
}).then(res => console.log('success'))
  .catch(err => console.log(err));
