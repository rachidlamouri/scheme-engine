import { Evaluable } from './interpreterNodes/evaluable';
import { globalExecutionContext } from './interpreterNodes/executionContext';

export const interpret = (evaluables: Evaluable[]): string => {
  globalExecutionContext.reset();
  return evaluables
    .map((evaluable) => {
      const result = evaluable.evaluate();
      const serializedResult = result.serialize();
      return serializedResult;
    })
    .join('\n');
}
