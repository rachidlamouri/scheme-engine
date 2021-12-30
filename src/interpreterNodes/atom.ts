import { Evaluable } from './evaluable';
import { executionContext } from './executionContext';

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
