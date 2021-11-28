import { LiteralContext } from '../language/compiled/SchemeParser';
import { parseSymbolicExpressionParentContext, SymbolicExpression } from './symbolicExpression';
import { Atom } from './atom';
import { OptionalChildContext, NodeParentContext, ParsedNode } from './utils';

export type Literal = SymbolicExpression;

export const parseLiteralParentContext = <
  TChildContext extends OptionalChildContext<LiteralContext>
>(parentContext: NodeParentContext<LiteralContext, TChildContext, 'literal'>): ParsedNode<Literal, LiteralContext, TChildContext> => {
  const literalContext = parentContext.literal();

  if (literalContext !== undefined) {
    return parseSymbolicExpressionParentContext(literalContext)
      ?? Atom.parseParentContext(literalContext) as ParsedNode<Literal, LiteralContext, TChildContext>;
  }

  return null as ParsedNode<Literal, LiteralContext, TChildContext>;
};
