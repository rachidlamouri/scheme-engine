import { Atom, BooleanAtom, IntegerAtom, ReferenceAtom, StringAtom } from '../interpreterNodes/atom';
import { Primitive } from '../interpreterNodes/utils';
import { AtomContext, BooleanAtomContext, IntegerAtomContext, ReferenceAtomContext, ReferenceAtomGroupContext, StringAtomContext } from '../language/compiled/SchemeParser';
import { buildRefineGroupContext, NormalizedGroupContext, UnhandledContextError } from './utils';

const refineStringAtomContext = (stringAtomContext: StringAtomContext): StringAtom => (
  new StringAtom(stringAtomContext.STRING().text)
);

export const refineIntegerAtomContext = (integerAtomContext: IntegerAtomContext): IntegerAtom => (
  new IntegerAtom(Number.parseInt(integerAtomContext.INTEGER().text))
);

export const refineBooleanAtomContext = (booleanAtomContext: BooleanAtomContext): BooleanAtom => {
  const literalValue = booleanAtomContext.BOOLEAN().text;

  if (['#t', '#f'].includes(literalValue)) {
    return new BooleanAtom(literalValue === '#t');
  }

  throw new UnhandledContextError(booleanAtomContext);
};

export const refineReferenceAtomContext = (referenceAtomContext: ReferenceAtomContext): ReferenceAtom => (
  new ReferenceAtom(referenceAtomContext.STRING().text)
);

export const refineReferenceAtomGroupContext = buildRefineGroupContext<
  ReferenceAtomContext,
  ReferenceAtomGroupContext,
  ReferenceAtom
>(
  (referenceAtomGroupContext: ReferenceAtomGroupContext): NormalizedGroupContext<ReferenceAtomContext, ReferenceAtomGroupContext> => ({
    elementContext: referenceAtomGroupContext.referenceAtom(),
    groupContext: referenceAtomGroupContext.referenceAtomGroup(),
  }),
  refineReferenceAtomContext,
);

export const refineAtomContext = (atomContext: AtomContext): Atom<Primitive> => {
  const stringAtomContext = atomContext.stringAtom();
  const integerAtomContext = atomContext.integerAtom();
  const booleanAtomContext = atomContext.booleanAtom();

  if (stringAtomContext !== undefined) {
    return refineStringAtomContext(stringAtomContext);
  } else if (integerAtomContext !== undefined) {
    return refineIntegerAtomContext(integerAtomContext);
  } else if (booleanAtomContext !== undefined) {
    return refineBooleanAtomContext(booleanAtomContext);
  }

  throw new UnhandledContextError(atomContext);
}
