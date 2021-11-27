import { LiteralContext } from '../language/compiled/SchemeParser';
import { parseSymbolicExpressionParentContext, SymbolicExpression } from './symbolicExpression';
import { Atom } from './atom';
import { ParentContext } from './utils';

export type Literal = SymbolicExpression;

type ChildLiteralContext = LiteralContext | undefined;

type LiteralParentContext<TChildContext> =
  [TChildContext] extends [LiteralContext]
    ? ParentContext<'literal', LiteralContext>
    : ParentContext<'literal', LiteralContext | undefined>

type ParsedLiteral<TChildContext extends ChildLiteralContext> =
  [TChildContext] extends [LiteralContext]
    ? Literal
    : Literal | null

export const parseLiteralParentContext = <
  TChildContext extends ChildLiteralContext
>(parentContext: LiteralParentContext<TChildContext>): ParsedLiteral<TChildContext> => {
  const literalContext = parentContext.literal();

  if (literalContext !== undefined) {
    return parseSymbolicExpressionParentContext(literalContext)
      ?? Atom.parseParentContext(literalContext) as ParsedLiteral<TChildContext>
  }

  return null as ParsedLiteral<TChildContext>;
};
