import { Evaluable } from '../interpreterNodes/evaluable';
import { EvaluableContext, EvaluableGroupContext } from '../language/compiled/SchemeParser';
import { refineReferenceLiteralContext } from './refineAtomContext';
import { refineCallExpressionContext } from './refineCallExpressionContext';
import { refineExplicitLiteralContext } from './refineExplicitLiteralContext';
import { refineLambdaReferenceDefinitionContext } from './refineLambdaReferenceDefinitionContext';
import { buildRefineGroupContext, NormalizedGroupContext, UnhandledContextError } from './utils';

export const refineEvaluableContext = (evaluableContext: EvaluableContext): Evaluable => {
  const callExpressionContext = evaluableContext.callExpression();
  const lambdaReferenceDefinitionContext = evaluableContext.lambdaReferenceDefinition();
  const referenceLiteralContext = evaluableContext.referenceLiteral();
  const explicitLiteralContext = evaluableContext.explicitLiteral();

  if (callExpressionContext !== undefined) {
    return refineCallExpressionContext(callExpressionContext);
  } else if (lambdaReferenceDefinitionContext !== undefined) {
    return refineLambdaReferenceDefinitionContext(lambdaReferenceDefinitionContext);
  } else if (referenceLiteralContext !== undefined) {
    return refineReferenceLiteralContext(referenceLiteralContext);
  } else if (explicitLiteralContext !== undefined) {
    return refineExplicitLiteralContext(explicitLiteralContext);
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
