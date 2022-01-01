import { CallExpression } from './callExpression';
import { Evaluable } from './evaluable';
import { globalExecutionContext } from './executionContext';

export class PredicateValuePair {
  constructor(private predicate: CallExpression, private evaluable: Evaluable) {}

  evaluatePredicate(): Evaluable {
    globalExecutionContext.log(`Evaluating: ${this.constructor.name}`);
    return this.predicate.evaluate();
  }

  evaluateValue(): Evaluable {
    globalExecutionContext.log(`Evaluating: ${this.constructor.name} value`);
    return this.evaluable.evaluate();
  }
}
