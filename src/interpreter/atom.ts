import { AtomContext, IntegerAtomContext, ReferenceAtomContext, StringAtomContext } from '../language/compiled/SchemeParser';
import { Evaluable } from './evaluable';
import { UnreachableError } from './utils';

type Primitive = string | number | boolean;

export abstract class Atom extends Evaluable {
  constructor(public readonly value: Primitive) {
    super();
  }

  evaluate(): Evaluable {
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

export class ReferenceAtom extends Atom {
  constructor(public readonly name: string) {
    super(`&${name}`);
  }
}

const refineStringAtomContext = (stringAtomContext: StringAtomContext): StringAtom => (
  new StringAtom(stringAtomContext.STRING().text)
);

export const refineIntegerAtomContext = (integerAtomContext: IntegerAtomContext): IntegerAtom => (
  new IntegerAtom(Number.parseInt(integerAtomContext.INTEGER().text))
);

export const refineReferenceAtomContext = (referenceAtomContext: ReferenceAtomContext): ReferenceAtom => (
  new ReferenceAtom(referenceAtomContext.STRING().text)
);

export const refineAtomContext = (atomContext: AtomContext): Atom => {
  const stringAtomContext = atomContext.stringAtom();
  const integerAtomContext = atomContext.integerAtom();

  if (stringAtomContext !== undefined && integerAtomContext === undefined) {
    return refineStringAtomContext(stringAtomContext);
  } else if (stringAtomContext === undefined && integerAtomContext !== undefined) {
    return refineIntegerAtomContext(integerAtomContext);
  }

  throw new UnreachableError();
}
