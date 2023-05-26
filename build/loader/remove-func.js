const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

module.exports = function(source) {
  const { removeFuncs } = this.query;
  if (!(removeFuncs && removeFuncs.length > 0)) return source;

  const ast = parse(source, { sourceType: 'module' });

  traverse(ast, {
    CallExpression(path) {
      const { name } = path.node.callee;
      if (removeFuncs.includes(name)) {
        path.remove();
      }
    }
  });

  return generate(ast).code;
};