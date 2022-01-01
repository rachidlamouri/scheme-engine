import { SymbolicExpression } from '../interpreterNodes/symbolicExpression';
import { LiteralContext } from '../language/compiled/SchemeParser';
import { refineBooleanAtomContext, refineIntegerAtomContext } from './refineAtomContext';
import { refineSymbolicExpressionContext } from './refineSymbolicExpressionContext';
import { UnhandledContextError } from './utils';

export const refineLiteralContext = (literalContext: LiteralContext): SymbolicExpression => {
  const symbolicExpressionContext = literalContext.symbolicExpression();
  const integerAtomContext = literalContext.integerAtom();
  const booleanAtomContext = literalContext.booleanAtom();

  if (symbolicExpressionContext !== undefined) {
    return refineSymbolicExpressionContext(symbolicExpressionContext);
  } else if (integerAtomContext !== undefined) {
    return refineIntegerAtomContext(integerAtomContext);
  } else if (booleanAtomContext !== undefined) {
    return refineBooleanAtomContext(booleanAtomContext);
  }

  throw new UnhandledContextError(literalContext);
};
