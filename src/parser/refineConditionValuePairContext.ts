import { Condition, ConditionValuePair } from '../interpreterNodes/conditionValuePair';
import { ConditionValuePairContext, ConditionValuePairGroupContext } from '../language/compiled/SchemeParser';
import { refineBooleanAtomContext, refineReferenceAtomContext } from './refineAtomContext';
import { refineCallExpressionContext } from './refineCallExpressionContext';
import { refineEvaluableContext } from './refineEvaluableContext';
import { buildRefineGroupContext, NormalizedGroupContext, UnhandledContextError } from './utils';

const refineConditionValuePairContext = (conditionValuePairContext: ConditionValuePairContext): ConditionValuePair => {
  const callExpressionContext = conditionValuePairContext.callExpression();
  const booleanAtomContext = conditionValuePairContext.booleanAtom();
  const referenceAtomContext = conditionValuePairContext.referenceAtom();
  const evaluableContext = conditionValuePairContext.evaluable();

  let condition: Condition | null = null;

  if (callExpressionContext !== undefined) {
    condition = refineCallExpressionContext(callExpressionContext);
  } else if (booleanAtomContext !== undefined) {
    condition = refineBooleanAtomContext(booleanAtomContext);
  } else if (referenceAtomContext !== undefined) {
    condition = refineReferenceAtomContext(referenceAtomContext);
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
