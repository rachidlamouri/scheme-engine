import { ReferenceAtomGroupContext } from '../language/compiled/SchemeParser';
import { ReferenceAtom, refineReferenceAtomContext } from './atom';

export const refineReferenceAtomGroupContext = (referenceAtomGroupContext: ReferenceAtomGroupContext): ReferenceAtom[] => {
  const innerReferenceAtomGroupContext = referenceAtomGroupContext.referenceAtomGroup();

  const firstNode = refineReferenceAtomContext(referenceAtomGroupContext.referenceAtom());
  const otherNodes = innerReferenceAtomGroupContext !== undefined ? refineReferenceAtomGroupContext(innerReferenceAtomGroupContext) : []

  return [firstNode, ...otherNodes];
};
