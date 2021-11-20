import { InputContext } from './language/compiled/SchemeParser';
import { interpreter, InterpretedResult } from './interpreter';

export const interpret = (rootTreeNode: InputContext): InterpretedResult => {
  const result = interpreter.visit(rootTreeNode);
  return result;
};
