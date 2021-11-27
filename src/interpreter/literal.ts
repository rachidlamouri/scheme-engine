import { LiteralContext } from '../language/compiled/SchemeParser';
import { parseSymbolicExpressionParentContext, SymbolicExpression } from './symbolicExpression';
import { Atom } from './atom';

export type Literal = SymbolicExpression;

export const parseLiteralParentContext = (parentContext: Record<'literal', () => LiteralContext | undefined>): Literal | null => {
  const literalContext = parentContext.literal();

  return (
    literalContext !== undefined
      ? parseSymbolicExpressionParentContext(literalContext) ?? Atom.parseParentContext(literalContext)
      : null
  ) as any;
};
