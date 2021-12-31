import { PredicateValuePair } from '../interpreterNodes/predicateValuePair';
import { PredicateValuePairContext, PredicateValuePairGroupContext } from '../language/compiled/SchemeParser';
import { refineCallExpressionContext } from './callExpression';
import { refineEvaluableContext } from './evaluable';
import { buildRefineGroupContext, NormalizedGroupContext } from './utils';

const refinePredicateValuePairContext = (predicateValuePairContext: PredicateValuePairContext): PredicateValuePair => (
  new PredicateValuePair(
    refineCallExpressionContext(predicateValuePairContext.callExpression()),
    refineEvaluableContext(predicateValuePairContext.evaluable())
  )
);

export const refinePredicateValuePairGroupContext = buildRefineGroupContext<
  PredicateValuePairContext,
  PredicateValuePairGroupContext,
  PredicateValuePair
>(
  (predicateValuePairGroupContext: PredicateValuePairGroupContext): NormalizedGroupContext<PredicateValuePairContext, PredicateValuePairGroupContext> => ({
    elementContext: predicateValuePairGroupContext.predicateValuePair(),
    groupContext: predicateValuePairGroupContext.predicateValuePairGroup(),
  }),
  refinePredicateValuePairContext,
);
