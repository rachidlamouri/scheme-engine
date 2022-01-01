import { ReferenceAtom } from './atom';
import { Evaluable } from './evaluable';

export class Lambda extends Evaluable {
  constructor(public readonly parameterReferences: ReferenceAtom[], private body: Evaluable) {
    super();
  }

  evaluate(parameters: Evaluable[]): Evaluable {
    super.logEvaluation();

    this.parameterReferences.forEach((reference, index) => {
      const value = parameters[index];
      reference.register(value);
    });

    return this.body.evaluate();
  }

  serialize(): string {
    throw Error('Not implemented');
  }
}
