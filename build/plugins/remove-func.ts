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
      if (!id.endsWith('.tsx')) return null;

      const ast = parse(code, { sourceType: 'module' });

      traverse(ast, {
        CallExpression(path) {
          const { name } = path.node.callee;
          if (args.includes(name)) {
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