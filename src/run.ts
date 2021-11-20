import { tokenize } from './tokenize';
import { parse } from './parse';
import { interpret } from './interpret';

export const run = (code: string) => {
  const tokens = tokenize(code);
  const rootAstNode = parse(tokens);
  const result = interpret(rootAstNode);
  process.stdout.write(result);
}
