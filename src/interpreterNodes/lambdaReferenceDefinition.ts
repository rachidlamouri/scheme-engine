import { Lambda } from './lambda';
import { ReferenceAtom } from './atom';
import { Evaluable } from './evaluable';

export class LambdaReferenceDefinition extends Evaluable {
  constructor(private reference: ReferenceAtom, private lambda: Lambda) {
    super();
  }

  evaluate(): Evaluable {
    super.logEvaluation();

    this.reference.register(this.lambda);
    return this.reference;
  }

  serialize(): string {
    throw Error('Not implemented');
  }
}
