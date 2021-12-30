import { LiteralContext } from '../language/compiled/SchemeParser';
import { refineSymbolicExpressionContext, SymbolicExpression } from './symbolicExpression';
import {  refineIntegerAtomContext } from './atom';
import { UnreachableError } from './utils';

export type Literal = SymbolicExpression;

export const refineLiteralContext = (literalContext: LiteralContext): Literal => {
  const symbolicExpressionContext = literalContext.symbolicExpression();
  const integerAtomContext = literalContext.integerAtom();

  if (symbolicExpressionContext !== undefined && integerAtomContext === undefined) {
    return refineSymbolicExpressionContext(symbolicExpressionContext);
  } else if (symbolicExpressionContext === undefined && integerAtomContext !== undefined) {
    return refineIntegerAtomContext(integerAtomContext);
  }

  throw new UnreachableError();
};
