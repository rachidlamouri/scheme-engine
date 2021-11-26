import { LiteralContext } from '../language/compiled/SchemeParser';
import { parseSymbolicExpressionParentContext, SymbolicExpression } from './symbolicExpression';
import { IntegerAtom } from './integerAtom';

export type Literal = SymbolicExpression | IntegerAtom;

export const parseLiteralParentContext = (parentContext: Record<'literal', () => LiteralContext | undefined>): Literal | null => {
  const literalContext = parentContext.literal();

  return (
    literalContext !== undefined
      ? parseSymbolicExpressionParentContext(literalContext) ?? IntegerAtom.parseParentContext(literalContext)!
      : null
  ) as any;
};
