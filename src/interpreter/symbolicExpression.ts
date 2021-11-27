import { AtomContext, SymbolicExpressionContext } from '../language/compiled/SchemeParser';
import { List } from './list';
import { Atom } from './atom';
import { ParentContext } from './utils';

export type SymbolicExpression = List | Atom;

type ChildSymbolicExpressionContext = SymbolicExpressionContext | undefined;

type SymbolicExpressionParentContext<TChildContext> =
  [TChildContext] extends [SymbolicExpressionContext]
    ? ParentContext<'symbolicExpression', SymbolicExpressionContext>
    : ParentContext<'symbolicExpression', SymbolicExpressionContext | undefined>

type ParsedSymbolicExpression<TChildContext extends ChildSymbolicExpressionContext> =
  [TChildContext] extends [SymbolicExpressionContext]
    ? SymbolicExpression
    : SymbolicExpression | null

export const parseSymbolicExpressionParentContext = <
  TChildContext extends ChildSymbolicExpressionContext
>(parentContext: SymbolicExpressionParentContext<TChildContext>): ParsedSymbolicExpression<TChildContext> => {
  const symbolicExpressionContext = parentContext.symbolicExpression();

  if (symbolicExpressionContext !== undefined) {
    return List.parseParentContext(symbolicExpressionContext)
    ?? Atom.parseParentContext<AtomContext | undefined>(symbolicExpressionContext) as ParsedSymbolicExpression<TChildContext>;
  }

  return null as ParsedSymbolicExpression<TChildContext>;
};
