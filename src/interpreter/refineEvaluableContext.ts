import { refineLiteralContext } from './literal';
import { refineCallExpressionContext } from './callExpression';
import { EvaluableContext } from '../language/compiled/SchemeParser';
import { UnhandledContextError } from './utils';
import { Evaluable } from './evaluable';
import { refineLambdaReferenceDefinitionContext } from './lambdaReferenceDefinition';
import { refineReferenceAtomContext } from './atom';

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
