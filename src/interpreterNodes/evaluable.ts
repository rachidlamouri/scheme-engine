import { ExecutionContext } from './executionContext';
import { Serializeable } from './utils';

export abstract class Evaluable<T = never> implements Serializeable {
  abstract evaluate(executionContext: ExecutionContext, arg?: T): Evaluable;

  protected logEvaluation(executionContext: ExecutionContext) {
    executionContext.log(`Evaluating: ${this.constructor.name}`);
  }

  abstract serialize(): string;
}
