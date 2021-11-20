import { tokenize } from './tokenize';
import { parse } from './parse';
import { interpret } from './interpret';
import { InterpretedResult } from './interpreter';

export const run = (code: string): InterpretedResult => {
  const tokens = tokenize(code);
  const rootAstNode = parse(tokens);
  const result = interpret(rootAstNode);
  return result;
}
