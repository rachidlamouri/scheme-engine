import { Evaluable } from '../interpreterNodes/evaluable';
import { EvaluableContext, EvaluableGroupContext } from '../language/compiled/SchemeParser';
import { refineReferenceAtomContext } from './atom';
import { refineCallExpressionContext } from './callExpression';
import { refineLambdaReferenceDefinitionContext } from './lambdaReferenceDefinition';
import { refineLiteralContext } from './literal';
import { buildRefineGroupContext, NormalizedGroupContext, UnhandledContextError } from './utils';

export const refineEvaluableContext = (evaluableContext: EvaluableContext): Evaluable => {
  const callExpressionContext = evaluableContext.callExpression();
  const lambdaReferenceDefinitionContext = evaluableContext.lambdaReferenceDefinition();
  const referenceAtomContext = evaluableContext.referenceAtom();
  const literalContext = evaluableContext.literal();

  if (callExpressionContext !== undefined) {
    return refineCallExpressionContext(callExpressionContext);
  } else if (lambdaReferenceDefinitionContext !== undefined) {
    return refineLambdaReferenceDefinitionContext(lambdaReferenceDefinitionContext);
  } else if (referenceAtomContext !== undefined) {
    return refineReferenceAtomContext(referenceAtomContext);
  } else if (literalContext !== undefined) {
    return refineLiteralContext(literalContext);
  }

  throw new UnhandledContextError(evaluableContext);
};

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