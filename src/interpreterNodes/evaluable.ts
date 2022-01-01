import { globalExecutionContext } from './executionContext';
import { Serializeable } from './utils';

export abstract class Evaluable implements Serializeable {
  abstract evaluate(...args: any[]): Evaluable;

  protected logEvaluation() {
    globalExecutionContext.log(`Evaluating: ${this.constructor.name}`);
  }

  abstract serialize(): string;
}
