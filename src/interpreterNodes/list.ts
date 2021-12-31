import { SymbolicExpression } from './symbolicExpression';
import { BooleanAtom } from './atom';
import { Evaluable } from './evaluable';

export class List extends Evaluable {
  constructor(private contents: SymbolicExpression[]) {
    super();
  }

  car(): Evaluable {
    return this.contents[0];
  }

  cdr(): List {
    return new List(this.contents.slice(1));
  }

  cons(symbolicExpression: SymbolicExpression): List {
    return new List([symbolicExpression, ...this.contents]);
  }

  evaluate(): Evaluable {
    return this;
  }

  isAtom() {
    return new BooleanAtom(false);
  }

  isEmpty() {
    return this.contents.length === 0;
  }

  isNull() {
    return new BooleanAtom(this.isEmpty());
  }

  serialize(): string {
    const contentsText = this.contents.map((item) => item.serialize()).join(' ');
    return `(${contentsText})`;
  }
}
