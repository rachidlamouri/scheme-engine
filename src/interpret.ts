import { InputContext } from './language/compiled/SchemeParser';
import { interpreter } from './interpreter/';

export const interpret = (rootAstNode: InputContext) => {
  const result = interpreter.visit(rootAstNode);
  return result;
};
