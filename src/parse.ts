import { CommonTokenStream } from 'antlr4ts';
import { InputContext, SchemeParser } from './language/compiled/SchemeParser';

export const parse = (tokenStream: CommonTokenStream): InputContext => {
  const parser = new SchemeParser(tokenStream);
  SchemeParser
  const rootAstNode = parser.input();
  return rootAstNode;
}
