import { tokenize } from './tokenize';
import { parse } from './parse';
import { interpret } from './interpreter/';

export const run = (code: string): string => {
  const tokens = tokenize(code);
  const rootAstNode = parse(tokens);
  const result = interpret(rootAstNode);
  return result;
}
