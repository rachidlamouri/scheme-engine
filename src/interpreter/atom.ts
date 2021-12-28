import { AtomContext, IntegerAtomContext, StringAtomContext } from '../language/compiled/SchemeParser';
import { SymbolicExpression } from './symbolicExpression';
import { ParentContext } from './utils';

type Primitive = string | number | boolean;

export abstract class Atom {
  constructor(public readonly value: Primitive) {}

  evaluate(): SymbolicExpression {
    return this;
  }

  isAtom() {
    return new BooleanAtom(true);
  }

  toString(): string {
    return `${this.value}`;
  }
}

export class StringAtom extends Atom {
  constructor(value: string) {
    super(value);
  }
}

export class IntegerAtom extends Atom {
  constructor(value: number) {
    super(value);
  }
}

export class BooleanAtom extends Atom {
  constructor(value: boolean) {
    super(value);
  }
}

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

export const parseAtomParentContext = <
  TChildContext extends ChildAtomContext
  >(parentContext: AtomParentContext<TChildContext>): ParsedAtom<TChildContext> => {
  let primitiveContext: StringAtomContext | IntegerAtomContext;
  if ('atom' in parentContext) {
    const atomContext = parentContext.atom();

    if (atomContext === undefined) {
      return null as ParsedAtom<TChildContext>;
    }

    primitiveContext = atomContext.stringAtom() ?? atomContext.integerAtom()!;
  } else {
    primitiveContext = parentContext.integerAtom()!;
  }

  if (primitiveContext instanceof StringAtomContext) {
    return new StringAtom(primitiveContext.text);
  }

  return new IntegerAtom(Number.parseInt(primitiveContext.text));
}
