import { AtomContext, IntegerAtomContext, ReferenceAtomContext, ReferenceAtomGroupContext, StringAtomContext } from '../language/compiled/SchemeParser';
import { Evaluable } from './evaluable';
import { executionContext } from './executionContext';
import { buildRefineGroupContext, NormalizedGroupContext, UnhandledContextError } from './utils';

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

  evaluate(): Evaluable {
    const evaluable = executionContext.lookup(this.name)

    if (evaluable === undefined) {
      throw Error(`Invalid reference "${this.name}"`);
    }

    return evaluable;
  }

  register(value: Evaluable) {
    executionContext.register(this.name, value);
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
