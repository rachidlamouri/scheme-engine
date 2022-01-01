import { ExecutionContext } from './executionContext';
import { Serializeable } from './utils';

export abstract class Evaluable implements Serializeable {
  abstract evaluate(executionContext: ExecutionContext): Evaluable;

  protected logEvaluation(executionContext: ExecutionContext) {
    executionContext.log(`Evaluating: ${this.constructor.name}`);
  }

  abstract serialize(): string;
}
