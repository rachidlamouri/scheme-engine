import { SymbolicExpression } from '../interpreterNodes/symbolicExpression';
import { ImplicitLiteralContext, LiteralContext } from '../language/compiled/SchemeParser';
import { refineBooleanLiteralContext, refineIntegerLiteralContext, refineStringLiteralContext } from './refineAtomContext';
import { refineListContext } from './refineListContext';
import { UnhandledContextError } from './utils';

export const refineImplicitLiteralContext = (implicitLiteralContext: ImplicitLiteralContext, isQuoted: boolean): SymbolicExpression => {
  const listContext = implicitLiteralContext.list();
  const stringLiteralContext = implicitLiteralContext.stringLiteral();
  const integerLiteralContext = implicitLiteralContext.integerLiteral();
  const booleanLiteralContext = implicitLiteralContext.booleanLiteral();

  if (listContext !== undefined) {
    return refineListContext(listContext);
  } else if (stringLiteralContext !== undefined) {
    return refineStringLiteralContext(stringLiteralContext);
  } else if (integerLiteralContext !== undefined) {
    return refineIntegerLiteralContext(integerLiteralContext, isQuoted);
  } else if (booleanLiteralContext !== undefined) {
    return refineBooleanLiteralContext(booleanLiteralContext, isQuoted);
  }

  throw new UnhandledContextError(implicitLiteralContext);
};
