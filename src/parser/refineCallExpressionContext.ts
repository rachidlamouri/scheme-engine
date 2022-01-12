import { CallExpressionContext } from '../language/compiled/SchemeParser';
import { BuiltInFunctionName, CallExpression, CarExpression, CdrExpression, ConditionExpression, ConsExpression, IsAtomExpression, IsEqualExpression, IsNullExpression, ReferenceCallExpression } from '../interpreterNodes/callExpression';
import { refineReferenceLiteralContext } from './refineAtomContext';
import { refineEvaluableContext, refineEvaluableGroupContext } from './refineEvaluableContext';
import { UnhandledContextError } from './utils';
import { refineConditionValuePairGroupContext } from './refineConditionValuePairContext';

export const refineCallExpressionContext = (callExpressionContext: CallExpressionContext): CallExpression => {
  const functionReferenceContext = callExpressionContext.referenceLiteral();
  const evaluableGroupContext = callExpressionContext.evaluableGroup();
  const conditionExpressionContext = callExpressionContext.conditionExpression();

  if (functionReferenceContext !== undefined) {
    const functionReference = refineReferenceLiteralContext(functionReferenceContext);
    const parameters = evaluableGroupContext !== undefined ? refineEvaluableGroupContext(evaluableGroupContext): [];

    switch (functionReference.key) {
      case BuiltInFunctionName.CAR:
          return new CarExpression(parameters);
      case BuiltInFunctionName.CDR:
        return new CdrExpression(parameters);
      case BuiltInFunctionName.CONS:
        return new ConsExpression(parameters);
      case BuiltInFunctionName.IS_NULL:
        return new IsNullExpression(parameters);
      case BuiltInFunctionName.IS_ATOM:
        return new IsAtomExpression(parameters);
      case BuiltInFunctionName.IS_EQUAL:
        return new IsEqualExpression(parameters);
    }

    return new ReferenceCallExpression(functionReference, parameters);
  } else if (conditionExpressionContext !== undefined) {
    const conditionValuePairs = refineConditionValuePairGroupContext(conditionExpressionContext.conditionValuePairGroup());
    const elseEvaluable = refineEvaluableContext(conditionExpressionContext.elseExpression().evaluable());

    return new ConditionExpression(conditionValuePairs, elseEvaluable);
  }

  throw new UnhandledContextError(callExpressionContext);
}
