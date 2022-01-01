import { Evaluable } from './interpreterNodes/evaluable';
import { Serializeable } from './interpreterNodes/utils';

export class InterpretedResult implements Serializeable  {
  constructor(public readonly evaluables: Evaluable[]) {}

  serialize() {
    return this.evaluables.map((e) => e.serialize()).join('\n');
  }
}

export const interpret = (evaluables: Evaluable[]): InterpretedResult => (
  new InterpretedResult(
    evaluables.map((e) => e.evaluate())
  )
);
