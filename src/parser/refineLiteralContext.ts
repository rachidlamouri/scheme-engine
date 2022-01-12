import { SymbolicExpression } from '../interpreterNodes/symbolicExpression';
import { LiteralContext, LiteralGroupContext } from '../language/compiled/SchemeParser';
import { refineExplicitLiteralContext } from './refineExplicitLiteralContext';
import { refineImplicitLiteralContext } from './refineImplicitLiteralContext';
import { buildRefineGroupContext, NormalizedGroupContext, UnhandledContextError } from './utils';

export const refineLiteralContext = (literalContext: LiteralContext): SymbolicExpression => {
  const explicitLiteralContext = literalContext.explicitLiteral();
  const implicitLiteralContext = literalContext.implicitLiteral();

  if (explicitLiteralContext !== undefined) {
    return refineExplicitLiteralContext(explicitLiteralContext);
  } else if (implicitLiteralContext !== undefined) {
    return refineImplicitLiteralContext(implicitLiteralContext, false);
  }

  throw new UnhandledContextError(literalContext);
};

export const refineLiteralGroupContext = buildRefineGroupContext<
  LiteralContext,
  LiteralGroupContext,
  SymbolicExpression
>(
  (literalGroupContext: LiteralGroupContext): NormalizedGroupContext<LiteralContext, LiteralGroupContext> => ({
    elementContext: literalGroupContext.literal(),
    groupContext: literalGroupContext.literalGroup(),
  }),
  refineLiteralContext,
);
