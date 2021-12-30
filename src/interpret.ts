import { Evaluable } from './interpreterNodes/evaluable';
import { executionContext } from './interpreterNodes/executionContext';

export const interpret = (evaluables: Evaluable[]): string => {
  executionContext.reset();
  return evaluables
    .map((evaluable) => {
      const result = evaluable.evaluate();
      const serializedResult = result.toString();
      return serializedResult;
    })
    .join('\n');
}
