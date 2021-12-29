import { refineLiteralContext } from './literal';
import { refineCallExpressionContext } from './callExpression';
import { EvaluableContext } from '../language/compiled/SchemeParser';
import { UnreachableError } from './utils';
import { Evaluable } from './evaluable';
import { refineLambdaReferenceDefinitionContext } from './lambdaReferenceDefinition';

export const refineEvaluableContext = (evaluableContext: EvaluableContext): Evaluable => {
  const callExpressionContext = evaluableContext.callExpression();
  const lambdaReferenceDefinitionContext = evaluableContext.lambdaReferenceDefinition();
  const literalContext = evaluableContext.literal();

  if (callExpressionContext !== undefined) {
    return refineCallExpressionContext(callExpressionContext);
  } else if (lambdaReferenceDefinitionContext !== undefined) {
    return refineLambdaReferenceDefinitionContext(lambdaReferenceDefinitionContext);
  } else if (literalContext !== undefined) {
    return refineLiteralContext(literalContext);
  }

  throw new UnreachableError();
};
