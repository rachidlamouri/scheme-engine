import { SymbolicExpression } from '../interpreterNodes/symbolicExpression';
import { LiteralContext } from '../language/compiled/SchemeParser';
import { refineIntegerAtomContext } from './atom';
import { refineSymbolicExpressionContext } from './symbolicExpression';
import { UnhandledContextError } from './utils';

export const refineLiteralContext = (literalContext: LiteralContext): SymbolicExpression => {
  const symbolicExpressionContext = literalContext.symbolicExpression();
  const integerAtomContext = literalContext.integerAtom();

  if (symbolicExpressionContext !== undefined) {
    return refineSymbolicExpressionContext(symbolicExpressionContext);
  } else if (integerAtomContext !== undefined) {
    return refineIntegerAtomContext(integerAtomContext);
  }

  throw new UnhandledContextError(literalContext);
};
