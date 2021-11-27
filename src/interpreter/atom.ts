import { AtomContext, IntegerAtomContext } from '../language/compiled/SchemeParser';

type ParentContext<Key extends string, ChildContext> = Record<Key, () => ChildContext | undefined>;

type AtomParentContext =
  ParentContext<'atom', AtomContext>
  | ParentContext<'integerAtom', IntegerAtomContext>

type ChildAtomContext = AtomContext | IntegerAtomContext | undefined;

type ParsedAtom<TChildContext extends ChildAtomContext> =
  TChildContext extends AtomContext
    ? Atom
    : null

export class Atom {
  static parseParentContext =<
  TChildContext extends ChildAtomContext
>(parentContext: AtomParentContext): ParsedAtom<TChildContext> => {
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

  toString(): string {
    return this.atomContext.text;
  }
}
