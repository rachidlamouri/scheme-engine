import { SymbolicExpressionContext, SymbolicExpressionGroupContext } from '../language/compiled/SchemeParser';
import { List, refineListContext } from './list';
import { Atom, refineAtomContext } from './atom';
import { buildRefineGroupContext, NormalizedGroupContext, UnhandledContextError } from './utils';

export type SymbolicExpression = List | Atom;

export const isSymbolicExpression = (arg: any): arg is SymbolicExpression => arg instanceof List || arg instanceof Atom;

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
