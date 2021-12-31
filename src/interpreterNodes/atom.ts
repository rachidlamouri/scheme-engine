import { Evaluable } from './evaluable';
import { globalExecutionContext } from './executionContext';
import { Primitive } from './utils';

export abstract class Atom<T extends Primitive> extends Evaluable {
  constructor(public readonly value: T) {
    super();
  }

  evaluate(): Evaluable {
    return this;
  }

  isAtom() {
    return new BooleanAtom(true);
  }

  serialize(): string {
    return `${this.value}`;
  }
}

export class StringAtom extends Atom<string> {
  constructor(value: string) {
    super(value);
  }
}

export class IntegerAtom extends Atom<number> {
  constructor(value: number) {
    super(value);
  }
}

export class BooleanAtom extends Atom<boolean> {
  constructor(value: boolean) {
    super(value);
  }

  serialize() {
    return this.value ? '#t' : '#f';
  }
}

export class ReferenceAtom extends Atom<string> {
  constructor(public readonly name: string) {
    super(`&${name}`);
  }

  evaluate(): Evaluable {
    const evaluable = globalExecutionContext.lookup(this.name)

    if (evaluable === undefined) {
      throw Error(`Invalid reference "${this.name}"`);
    }

    return evaluable;
  }

  register(value: Evaluable) {
    globalExecutionContext.register(this.name, value);
  }
}
