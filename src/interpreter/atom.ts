import { AtomContext, IntegerAtomContext } from '../language/compiled/SchemeParser';
import { SchemeBoolean } from './schemeBoolean';
import { ParentContext } from './utils';

type ChildAtomContext = AtomContext | IntegerAtomContext | undefined;

type AtomParentContext<TChildContext extends ChildAtomContext> =
  [TChildContext] extends [AtomContext]
    ? ParentContext<'atom', AtomContext>
    : [TChildContext] extends [AtomContext | undefined]
      ? ParentContext<'atom', AtomContext | undefined>
      : [TChildContext] extends [IntegerAtomContext]
        ? ParentContext<'integerAtom', IntegerAtomContext>
        : ParentContext<'integerAtom', IntegerAtomContext | undefined>;

type ParsedAtom<TChildContext extends ChildAtomContext> =
  [TChildContext] extends [AtomContext | IntegerAtomContext]
    ? Atom
    : Atom | null;

export class Atom {
  static parseParentContext = <
    TChildContext extends ChildAtomContext
  >(parentContext: AtomParentContext<TChildContext>): ParsedAtom<TChildContext> => {
    const atomContext =
      'atom' in parentContext
        ? parentContext.atom()
        : parentContext.integerAtom();

    if (atomContext !== undefined) {
      return new Atom(atomContext) as ParsedAtom<TChildContext>;
    }

    return null as ParsedAtom<TChildContext>;
  };

  constructor (private atomContext: AtomContext | IntegerAtomContext) {}

  isAtom() {
    return new SchemeBoolean(true);
  }

  toString(): string {
    return this.atomContext.text;
  }
}
