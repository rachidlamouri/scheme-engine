import { CallExpression } from './callExpression';
import { Evaluable } from './evaluable';
import { ExecutionContext } from './executionContext';

export class PredicateValuePair {
  constructor(private predicate: CallExpression, private evaluable: Evaluable) {}

  evaluatePredicate(executionContext: ExecutionContext): Evaluable {
    executionContext.log(`Evaluating: ${this.constructor.name}`);
    return this.predicate.evaluate(executionContext);
  }

  evaluateValue(executionContext: ExecutionContext): Evaluable {
    executionContext.log(`Evaluating: ${this.constructor.name} value`);
    return this.evaluable.evaluate(executionContext);
  }
}
