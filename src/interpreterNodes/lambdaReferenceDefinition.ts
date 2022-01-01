import { Lambda } from './lambda';
import { ReferenceAtom } from './atom';
import { Evaluable } from './evaluable';
import { ExecutionContext } from './executionContext';

export class LambdaReferenceDefinition extends Evaluable {
  constructor(private reference: ReferenceAtom, private lambda: Lambda) {
    super();
  }

  evaluate(executionContext: ExecutionContext): Evaluable {
    super.logEvaluation(executionContext);

    executionContext.createAndRegisterClosure(this.reference, this.lambda);

    return this.reference;
  }

  serialize(): string {
    throw Error('Not implemented');
  }
}
