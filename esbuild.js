const { build } = require("esbuild");

build({
  entryPoints: ["src/index.tsx"],
  outfile: "dist/index.js",
  bundle: true,
  watch: true,
  minify: false,
  loader: {
    '.tsx': 'tsx',
  },
  tsconfig: './tsconfig.json',
}).then(res => console.log('success'))
  .catch(err => console.log(err));
