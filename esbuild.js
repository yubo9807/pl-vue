const { build } = require("esbuild")

build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  watch: true,
  minify: false,
}).then(res => console.log('success'))
  .catch(err => console.log(err));
