import { EvaluableGroupContext } from '../language/compiled/SchemeParser';
import { refineEvaluableContext } from './refineEvaluableContext';
import { Evaluable } from './evaluable';

export const refineEvaluableGroupContext = (evaluableGroupContext: EvaluableGroupContext): Evaluable[] => {
  const innerEvaluableGroupContext = evaluableGroupContext.evaluableGroup();

  const firstNode = refineEvaluableContext(evaluableGroupContext.evaluable());
  const otherNodes = innerEvaluableGroupContext !== undefined ? refineEvaluableGroupContext(innerEvaluableGroupContext) : []

  return [firstNode, ...otherNodes];
};
