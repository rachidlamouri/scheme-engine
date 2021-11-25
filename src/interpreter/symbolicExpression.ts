import { SymbolicExpressionContext } from '../language/compiled/SchemeParser';
import { List } from './list';
import { Atom } from './atom'

export const parseSymbolicExpressionParentContext = (parentContext: Record<'symbolicExpression', () => SymbolicExpressionContext>): List | Atom => {
  const symbolicExpressionContext = parentContext.symbolicExpression();
  return List.parseParentContext(symbolicExpressionContext) ?? Atom.parseParentContext(symbolicExpressionContext)!;
};

export type SymbolicExpression = List | Atom;
