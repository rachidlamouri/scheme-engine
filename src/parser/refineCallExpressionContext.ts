import { CallExpressionContext } from '../language/compiled/SchemeParser';
import { BuiltInFunctionName, CallExpression, CarExpression, CdrExpression, ConditionExpression, ConsExpression, IsAtomExpression, IsEqualExpression, IsNullExpression, ReferenceCallExpression } from '../interpreterNodes/callExpression';
import { refineReferenceAtomContext } from './refineAtomContext';
import { refineEvaluableContext, refineEvaluableGroupContext } from './refineEvaluableContext';
import { UnhandledContextError } from './utils';
import { refinePredicateValuePairGroupContext } from './refinePredicateValuePairContext';

export const refineCallExpressionContext = (callExpressionContext: CallExpressionContext): CallExpression => {
  const functionReferenceContext = callExpressionContext.referenceAtom();
  const evaluableGroupContext = callExpressionContext.evaluableGroup();
  const conditionExpressionContext = callExpressionContext.conditionExpression();

  if (functionReferenceContext !== undefined) {
    const functionReference = refineReferenceAtomContext(functionReferenceContext);
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
    const predicateValuePairs = refinePredicateValuePairGroupContext(conditionExpressionContext.predicateValuePairGroup());
    const elseEvaluable = refineEvaluableContext(conditionExpressionContext.elseExpression().evaluable());

    return new ConditionExpression(predicateValuePairs, elseEvaluable);
  }

  throw new UnhandledContextError(callExpressionContext);
}
