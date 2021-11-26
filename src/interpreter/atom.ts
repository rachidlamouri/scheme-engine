import { AtomContext } from '../language/compiled/SchemeParser';
import { IntegerAtom } from './integerAtom';
import { StringAtom } from './stringAtom';

export type Atom = StringAtom | IntegerAtom;

export const parseAtomParentContext = (parentContext: Record<'atom', () => AtomContext | undefined>): Atom | null => {
  const atomContext = parentContext.atom();

  return (
    atomContext !== undefined
      ? StringAtom.parseParentContext(atomContext) ?? IntegerAtom.parseParentContext(atomContext)!
      : null
  ) as any;
};

export const isAtom = (arg: any): arg is Atom => (
  arg instanceof StringAtom
  || arg instanceof IntegerAtom
);
