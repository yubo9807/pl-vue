
module.exports = function() {
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