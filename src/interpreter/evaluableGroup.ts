import { EvaluableContext, EvaluableGroupContext } from '../language/compiled/SchemeParser';
import { refineEvaluableContext } from './refineEvaluableContext';
import { Evaluable } from './evaluable';
import { buildRefineGroupContext, NormalizedGroupContext } from './utils';

export const refineEvaluableGroupContext = buildRefineGroupContext<
  EvaluableContext,
  EvaluableGroupContext,
  Evaluable
>(
  (evaluableGroupContext: EvaluableGroupContext): NormalizedGroupContext<EvaluableContext, EvaluableGroupContext> => ({
    elementContext: evaluableGroupContext.evaluable(),
    groupContext: evaluableGroupContext.evaluableGroup(),
  }),
  refineEvaluableContext,
);
