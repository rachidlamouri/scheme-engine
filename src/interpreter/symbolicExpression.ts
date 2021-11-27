import { SymbolicExpressionContext } from '../language/compiled/SchemeParser';
import { List } from './list';
import { Atom } from './atom';

export type SymbolicExpression = List | Atom;

export const parseSymbolicExpressionParentContext = <
  TChildContext extends SymbolicExpressionContext | undefined
>(parentContext: Record<'symbolicExpression', () => TChildContext>): TChildContext extends SymbolicExpressionContext ? SymbolicExpression : null => {
  const symbolicExpressionContext = parentContext.symbolicExpression();

  return (
    symbolicExpressionContext !== undefined
      ? List.parseParentContext(symbolicExpressionContext) ?? Atom.parseParentContext(symbolicExpressionContext)!
      : null
  ) as any;
};
