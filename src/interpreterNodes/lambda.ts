import { ReferenceAtom } from './atom';
import { Evaluable } from './evaluable';
import { ExecutionContext } from './executionContext';

export class Lambda extends Evaluable {
  constructor(public readonly parameterReferences: ReferenceAtom[], private body: Evaluable) {
    super();
  }

  /**
   * @param executionContext An ExecutionContext with with pre-bound parameter references
   */
  evaluate(executionContext: ExecutionContext): Evaluable {
    super.logEvaluation(executionContext);
    return this.body.evaluate(executionContext);
  }

  serialize(): string {
    throw Error('Not implemented');
  }
}
