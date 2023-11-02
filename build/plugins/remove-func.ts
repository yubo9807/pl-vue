import { parse } from '@babel/parser';
import { default as traverse } from '@babel/traverse';
import { default as generate } from '@babel/generator';

/**
 * 删除函数调用
 * @param args 
 * @returns 
 */
export default function (...args: string[]) {
  return {
    name: 'remove-func',

    transform(code: string, id: string) {
      if (!/\.(ts|tsx|js|jsx)$/.test(id)) return null;

      const ast = parse(code, { sourceType: 'module' });

      traverse(ast, {
        // 删除导出
        ExportNamedDeclaration(path) {
          const specifiers = path.node.specifiers;
          for (const specifier of specifiers) {
            const { name, type } = specifier.exported;
            if (type === 'Identifier' && args.includes(name)) {
              path.remove();
            }
          }
        },
        // 删除调用
        CallExpression(path) {
          const { name, type } = path.node.callee;
          if (type === 'Identifier' && args.includes(name)) {
            path.remove();
          }
        }
      });

      return {
        code: generate(ast).code,
        map: null,
      };
    },
  }
}