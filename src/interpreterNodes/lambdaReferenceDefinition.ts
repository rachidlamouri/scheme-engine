import { Lambda } from './lambda';
import { ReferenceAtom } from './atom';
import { Evaluable } from './evaluable';

export class LambdaReferenceDefinition implements Evaluable {
  constructor(private reference: ReferenceAtom, private lambda: Lambda) {}

  evaluate(): Evaluable {
    this.reference.register(this.lambda);
    return this.reference;
  }
}
