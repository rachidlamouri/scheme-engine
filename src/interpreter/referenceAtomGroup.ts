import { ReferenceAtomContext, ReferenceAtomGroupContext } from '../language/compiled/SchemeParser';
import { ReferenceAtom, refineReferenceAtomContext } from './atom';
import { buildRefineGroupContext, NormalizedGroupContext } from './utils';

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
