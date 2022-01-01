import { Evaluable } from './evaluable';
import { globalExecutionContext } from './executionContext';
import { Primitive } from './utils';

export abstract class Atom<T extends Primitive> extends Evaluable {
  constructor(public readonly value: T) {
    super();
  }

  evaluate(): Evaluable {
    super.logEvaluation();
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
  constructor(public readonly key: string) {
    super(`&${key}`);
  }

  evaluate(): Evaluable {
    super.logEvaluation();

    const evaluable = globalExecutionContext.lookup(this.key)

    if (evaluable === undefined) {
      throw Error(`Invalid reference "${this.key}"`);
    }

    return evaluable;
  }

  register(value: Evaluable) {
    globalExecutionContext.register(this.key, value);
  }
}
