import { AtomContext, SymbolicExpressionContext } from '../language/compiled/SchemeParser';
import { List } from './list';
import { Atom } from './atom';
import { OptionalChildContext, NodeParentContext, ParsedNode } from './utils';
import { SchemeBoolean } from './schemeBoolean';

export type SymbolicExpression = List | Atom | SchemeBoolean;

export const isSymbolicExpression = (arg: any): arg is SymbolicExpression => arg instanceof List || arg instanceof Atom;

export const parseSymbolicExpressionParentContext = <
  TChildContext extends OptionalChildContext<SymbolicExpressionContext>
>(parentContext: NodeParentContext<SymbolicExpressionContext, TChildContext, 'symbolicExpression'>): ParsedNode<SymbolicExpression, SymbolicExpressionContext, TChildContext> => {
  const symbolicExpressionContext = parentContext.symbolicExpression();

  if (symbolicExpressionContext !== undefined) {
    return List.parseParentContext(symbolicExpressionContext)
    ?? Atom.parseParentContext<AtomContext | undefined>(symbolicExpressionContext) as ParsedNode<SymbolicExpression, SymbolicExpressionContext, TChildContext>;
  }

  return null as ParsedNode<SymbolicExpression, SymbolicExpressionContext, TChildContext>;
};
