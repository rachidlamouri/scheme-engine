import { SymbolicExpressionContext, SymbolicExpressionGroupContext } from '../language/compiled/SchemeParser';
import { refineSymbolicExpressionContext, SymbolicExpression } from './symbolicExpression';
import { buildRefineGroupContext, NormalizedGroupContext } from './utils';

export const refineSymbolicExpressionGroupContext = buildRefineGroupContext<
  SymbolicExpressionContext,
  SymbolicExpressionGroupContext,
  SymbolicExpression
>(
  (symbolicExpressionGroupContext: SymbolicExpressionGroupContext): NormalizedGroupContext<SymbolicExpressionContext, SymbolicExpressionGroupContext> => ({
    elementContext: symbolicExpressionGroupContext.symbolicExpression(),
    groupContext: symbolicExpressionGroupContext.symbolicExpressionGroup(),
  }),
  refineSymbolicExpressionContext,
);
