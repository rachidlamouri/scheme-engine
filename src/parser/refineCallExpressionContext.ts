import { CallExpressionContext } from '../language/compiled/SchemeParser';
import { AdditionExpression, BuiltInFunctionName, CallExpression, CarExpression, CdrExpression, ConditionExpression, ConsExpression, IsAtomExpression, IsEqualExpression, IsNullExpression, ReferenceCallExpression, SubtractionExpression } from '../interpreterNodes/callExpression';
import { refineReferenceLiteralContext } from './refineAtomContext';
import { refineEvaluableContext, refineEvaluableGroupContext } from './refineEvaluableContext';
import { UnhandledContextError } from './utils';
import { refineConditionValuePairGroupContext } from './refineConditionValuePairContext';
import { ReferenceAtom } from '../interpreterNodes/atom';

export const refineCallExpressionContext = (callExpressionContext: CallExpressionContext): CallExpression => {
  const functionReferenceContext = callExpressionContext.referenceLiteral();
  const plusLiteralContext = callExpressionContext.plusLiteral();
  const minusLiteralContext = callExpressionContext.minusLiteral();
  const evaluableGroupContext = callExpressionContext.evaluableGroup();
  const conditionExpressionContext = callExpressionContext.conditionExpression();

  let functionName: string | null = null;
  let functionReference: ReferenceAtom | null = null;
  if (functionReferenceContext !== undefined) {
    functionReference = refineReferenceLiteralContext(functionReferenceContext);
    functionName = functionReference.key;
  } else if (plusLiteralContext !== undefined) {
    functionName = plusLiteralContext.PLUS().text;
  } else if (minusLiteralContext !== undefined) {
    functionName = minusLiteralContext.MINUS().text;
  }

  if (functionName !== null) {
    const parameters = evaluableGroupContext !== undefined ? refineEvaluableGroupContext(evaluableGroupContext): [];

    switch (functionName) {
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
      case BuiltInFunctionName.ADD:
        return new AdditionExpression(parameters);
      case BuiltInFunctionName.SUBTRACT:
        return new SubtractionExpression(parameters);
    }

    if (functionReference !== null) {
      return new ReferenceCallExpression(functionReference, parameters);
    }
  } else if (conditionExpressionContext !== undefined) {
    const conditionValuePairs = refineConditionValuePairGroupContext(conditionExpressionContext.conditionValuePairGroup());
    const elseEvaluable = refineEvaluableContext(conditionExpressionContext.elseExpression().evaluable());

    return new ConditionExpression(conditionValuePairs, elseEvaluable);
  }

  throw new UnhandledContextError(callExpressionContext);
}
