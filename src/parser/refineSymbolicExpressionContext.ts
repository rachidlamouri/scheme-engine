import { SymbolicExpression } from '../interpreterNodes/symbolicExpression';
import { SymbolicExpressionContext, SymbolicExpressionGroupContext } from '../language/compiled/SchemeParser';
import { refineAtomContext } from './refineAtomContext';
import { refineListContext } from './refineListContext';
import { buildRefineGroupContext, NormalizedGroupContext, UnhandledContextError } from './utils';

export const refineSymbolicExpressionContext = (symbolicExpressionContext: SymbolicExpressionContext): SymbolicExpression => {
  const listContext = symbolicExpressionContext.list();
  const atomContext = symbolicExpressionContext.atom();

  if (listContext !== undefined) {
    return refineListContext(listContext);
  } else if (atomContext !== undefined) {
    return refineAtomContext(atomContext);
  }

  throw new UnhandledContextError(symbolicExpressionContext);
};

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
