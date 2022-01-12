import { SymbolicExpression } from '../interpreterNodes/symbolicExpression';
import { ExplicitLiteralContext, } from '../language/compiled/SchemeParser';
import { refineBooleanLiteralContext, refineIntegerLiteralContext } from './refineAtomContext';
import { refineImplicitLiteralContext } from './refineImplicitLiteralContext';
import { UnhandledContextError } from './utils';

export const refineExplicitLiteralContext = (explicitLiteralContext: ExplicitLiteralContext): SymbolicExpression => {
  const implicitLiteralContext = explicitLiteralContext.implicitLiteral();
  const integerLiteralContext = explicitLiteralContext.integerLiteral();
  const booleanLiteralContext = explicitLiteralContext.booleanLiteral();

  if (implicitLiteralContext !== undefined) {
    return refineImplicitLiteralContext(implicitLiteralContext, true);
  } else if (integerLiteralContext !== undefined) {
    return refineIntegerLiteralContext(integerLiteralContext, false);
  } else if (booleanLiteralContext !== undefined) {
    return refineBooleanLiteralContext(booleanLiteralContext, false);
  }

  throw new UnhandledContextError(explicitLiteralContext);
};
