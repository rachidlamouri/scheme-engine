import { CallExpressionContext } from '../language/compiled/SchemeParser';
import { BuiltInFunctionName, CallExpression, CarExpression, CdrExpression, ConsExpression, IsAtomExpression, IsEqualExpression, IsNullExpression, ReferenceCallExpression } from '../interpreterNodes/callExpression';
import { refineReferenceAtomContext } from './atom';
import { refineEvaluableGroupContext } from './evaluable';

export const refineCallExpressionContext = (callExpressionContext: CallExpressionContext): CallExpression => {
  const functionReference = refineReferenceAtomContext(callExpressionContext.referenceAtom());
  const evaluableGroupContext = callExpressionContext.evaluableGroup();
  const parameters = evaluableGroupContext !== undefined ? refineEvaluableGroupContext(evaluableGroupContext): [];

  switch (functionReference.name) {
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
}
