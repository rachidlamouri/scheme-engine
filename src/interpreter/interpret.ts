import { Evaluable } from './evaluable';

export const interpret = (evaluables: Evaluable[]): string => {
  return evaluables
    .map((evaluable) => {
      const result = evaluable.evaluate();
      const serializedResult = result.toString();
      return serializedResult;
    })
    .join('\n');
}
