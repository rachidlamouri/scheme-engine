import { Atom, IntegerAtom, ReferenceAtom, StringAtom } from '../interpreterNodes/atom';
import { AtomContext, IntegerAtomContext, ReferenceAtomContext, ReferenceAtomGroupContext, StringAtomContext } from '../language/compiled/SchemeParser';
import { buildRefineGroupContext, NormalizedGroupContext, UnhandledContextError } from './utils';

const refineStringAtomContext = (stringAtomContext: StringAtomContext): StringAtom => (
  new StringAtom(stringAtomContext.STRING().text)
);

export const refineIntegerAtomContext = (integerAtomContext: IntegerAtomContext): IntegerAtom => (
  new IntegerAtom(Number.parseInt(integerAtomContext.INTEGER().text))
);

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

export const refineAtomContext = (atomContext: AtomContext): Atom => {
  const stringAtomContext = atomContext.stringAtom();
  const integerAtomContext = atomContext.integerAtom();

  if (stringAtomContext !== undefined) {
    return refineStringAtomContext(stringAtomContext);
  } else if (integerAtomContext !== undefined) {
    return refineIntegerAtomContext(integerAtomContext);
  }

  throw new UnhandledContextError(atomContext);
}
