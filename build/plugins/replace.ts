
export function replaceVersion() {
  return {
    name: 'replace-version',

    transform(code, id) {
      return code.replace('process.env.version', `'${process.env.npm_package_version}'`);
    },
  }
}

export function replaceModuleName() {
  return {
    name: 'replace-module-name',

    renderChunk(code) {
      const matched = code.match(/require\(.+?\)/g);
      if (matched) {
        matched.forEach(val => {
          const [,moduleName] = val.match(/require\('(.+)?'\)/);
          code = code.replace(moduleName, moduleName+'/index.cjs')
        });
      }
      return code;
    }
  }
}