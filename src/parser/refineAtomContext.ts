import { Atom, BooleanAtom, IntegerAtom, ReferenceAtom, StringAtom } from '../interpreterNodes/atom';
import { Primitive } from '../interpreterNodes/utils';
import { BooleanLiteralContext, IntegerLiteralContext, ReferenceLiteralContext, ReferenceLiteralGroupContext, StringLiteralContext } from '../language/compiled/SchemeParser';
import { buildRefineGroupContext, NormalizedGroupContext, UnhandledContextError } from './utils';

type QuotableAtom<B extends boolean, A extends Atom<Primitive>> =  B extends true ? StringAtom : A;

export const refineStringLiteralContext = (stringLiteralContext: StringLiteralContext): StringAtom => (
  new StringAtom(stringLiteralContext.STRING().text)
);

export const refineIntegerLiteralContext = <T extends boolean>(integerLiteralContext: IntegerLiteralContext, isQuoted: T): QuotableAtom<T, IntegerAtom> => {
  const textValue = integerLiteralContext.INTEGER().text;

  if (isQuoted) {
    return new StringAtom(textValue) as QuotableAtom<T, IntegerAtom>;
  }

  return new IntegerAtom(Number.parseInt(textValue)) as QuotableAtom<T, IntegerAtom>;
};

export const refineBooleanLiteralContext = <T extends boolean>(booleanLiteralContext: BooleanLiteralContext, isQuoted: T): QuotableAtom<T, BooleanAtom> => {
  const textValue = booleanLiteralContext.BOOLEAN().text;

  if (['#t', '#f'].includes(textValue)) {
    if (isQuoted) {
      return new StringAtom(textValue) as QuotableAtom<T, BooleanAtom>
    }

    return new BooleanAtom(textValue === '#t') as QuotableAtom<T, BooleanAtom>;
  }

  throw new UnhandledContextError(booleanLiteralContext);
};

export const refineReferenceLiteralContext = (referenceLiteralContext: ReferenceLiteralContext): ReferenceAtom => (
  new ReferenceAtom(referenceLiteralContext.STRING().text)
);

export const refineReferenceLiteralGroupContext = buildRefineGroupContext<
  ReferenceLiteralContext,
  ReferenceLiteralGroupContext,
  ReferenceAtom
>(
  (referenceLiteralGroupContext: ReferenceLiteralGroupContext): NormalizedGroupContext<ReferenceLiteralContext, ReferenceLiteralGroupContext> => ({
    elementContext: referenceLiteralGroupContext.referenceLiteral(),
    groupContext: referenceLiteralGroupContext.referenceLiteralGroup(),
  }),
  refineReferenceLiteralContext,
);
