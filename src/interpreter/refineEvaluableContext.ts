import { refineLiteralContext } from './literal';
import { refineCallExpressionContext } from './callExpression';
import { EvaluableContext } from '../language/compiled/SchemeParser';
import { UnreachableError } from './utils';
import { Evaluable } from './evaluable';

export const refineEvaluableContext = (evaluableContext: EvaluableContext): Evaluable => {
  const callExpressionContext = evaluableContext.callExpression();
  const literalContext = evaluableContext.literal();

  if (callExpressionContext !== undefined && literalContext === undefined) {
    return refineCallExpressionContext(callExpressionContext);
  } else if (callExpressionContext === undefined && literalContext !== undefined) {
    return refineLiteralContext(literalContext);
  }

  throw new UnreachableError();
};
