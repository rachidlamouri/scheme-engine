import { InputContext } from '../language/compiled/SchemeParser';
import { executionContext } from './executionContext';
import { refineInputContext } from './input';

export const interpret = (rootAstNode: InputContext): string => {
  executionContext.reset();
  return refineInputContext(rootAstNode)
    .map((evaluable) => {
      const result = evaluable.evaluate();
      const serializedResult = result.toString();
      return serializedResult;
    })
    .join('\n');
}
