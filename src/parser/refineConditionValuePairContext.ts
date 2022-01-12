import { Condition, ConditionValuePair } from '../interpreterNodes/conditionValuePair';
import { ConditionValuePairContext, ConditionValuePairGroupContext } from '../language/compiled/SchemeParser';
import { refineBooleanLiteralContext, refineReferenceLiteralContext } from './refineAtomContext';
import { refineCallExpressionContext } from './refineCallExpressionContext';
import { refineEvaluableContext } from './refineEvaluableContext';
import { buildRefineGroupContext, NormalizedGroupContext, UnhandledContextError } from './utils';

const refineConditionValuePairContext = (conditionValuePairContext: ConditionValuePairContext): ConditionValuePair => {
  const callExpressionContext = conditionValuePairContext.callExpression();
  const booleanLiteralContext = conditionValuePairContext.booleanLiteral();
  const referenceLiteralContext = conditionValuePairContext.referenceLiteral();
  const evaluableContext = conditionValuePairContext.evaluable();

  let condition: Condition | null = null;

  if (callExpressionContext !== undefined) {
    condition = refineCallExpressionContext(callExpressionContext);
  } else if (booleanLiteralContext !== undefined) {
    condition = refineBooleanLiteralContext(booleanLiteralContext, false);
  } else if (referenceLiteralContext !== undefined) {
    condition = refineReferenceLiteralContext(referenceLiteralContext);
  }

  if (condition !== null) {
    return new ConditionValuePair(condition, refineEvaluableContext(evaluableContext));
  }

  throw new UnhandledContextError(conditionValuePairContext);
};

export const refineConditionValuePairGroupContext = buildRefineGroupContext<
  ConditionValuePairContext,
  ConditionValuePairGroupContext,
  ConditionValuePair
>(
  (conditionValuePairGroupContext: ConditionValuePairGroupContext): NormalizedGroupContext<ConditionValuePairContext, ConditionValuePairGroupContext> => ({
    elementContext: conditionValuePairGroupContext.conditionValuePair(),
    groupContext: conditionValuePairGroupContext.conditionValuePairGroup(),
  }),
  refineConditionValuePairContext,
);
