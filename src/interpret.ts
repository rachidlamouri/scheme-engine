import { InputContext } from './language/compiled/SchemeParser';
import { interpreter, InterpretedResult } from './interpreter/';

export const interpret = (rootAstNode: InputContext): InterpretedResult => {
  const result = interpreter.visit(rootAstNode);
  return result;
};
